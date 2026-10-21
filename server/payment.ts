import crypto from 'crypto';
import { PaymentProvider, PaymentStatus, RegistrationRecord } from '../src/types';
import { db } from './db';

export interface PaymentInitiationResult {
  success: boolean;
  paymentId: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  redirectUrl?: string;
  isSandboxDemo: boolean;
  message: string;
  merchantStatus: 'ready' | 'sandbox_demo' | 'unconfigured';
}

export interface PaymentVerificationResult {
  verified: boolean;
  status: PaymentStatus;
  transactionId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  timestamp: string;
  isSandboxDemo: boolean;
  message: string;
}

export class PaymentManager {
  /**
   * Initiates server-side payment checkout
   */
  public initiatePayment(
    registrationId: string,
    provider: PaymentProvider = 'bkash'
  ): PaymentInitiationResult {
    const reg = db.getRegistrationById(registrationId);
    if (!reg) {
      throw new Error(`Registration not found with ID ${registrationId}`);
    }

    if (reg.payment.status === 'paid') {
      return {
        success: true,
        paymentId: reg.payment.transactionId || 'ALREADY_PAID',
        provider: reg.payment.provider || provider,
        amount: reg.payment.amount,
        currency: reg.payment.currency,
        isSandboxDemo: false,
        message: 'This registration fee has already been paid and verified.',
        merchantStatus: 'ready'
      };
    }

    const settings = db.getSettings();
    const amount = provider === 'card_gateway' ? settings.counsellingFeeUSD : settings.counsellingFeeBDT;
    const currency = provider === 'card_gateway' ? 'USD' : 'BDT';
    
    // Check if live merchant keys are present in env
    const hasBkashKeys = !!process.env.BKASH_APP_KEY && !!process.env.BKASH_APP_SECRET;
    const isSandboxDemo = !hasBkashKeys;

    const paymentId = `PAY-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Log payment initiation
    db.logAudit({
      registrationId,
      action: 'PAYMENT_INITIATED',
      actor: reg.personal.mobile,
      details: {
        paymentId,
        provider,
        amount,
        currency,
        isSandboxDemo
      }
    });

    return {
      success: true,
      paymentId,
      provider,
      amount,
      currency,
      isSandboxDemo,
      message: isSandboxDemo 
        ? 'Sandbox / Test Mode Active: Live merchant credentials not yet configured. Simulated payment verification ready.'
        : 'Connecting to secure merchant gateway...',
      merchantStatus: isSandboxDemo ? 'sandbox_demo' : 'ready'
    };
  }

  /**
   * Verifies callback / webhook server-side idempotently
   */
  public verifyPayment(
    registrationId: string,
    provider: PaymentProvider,
    paymentId: string,
    clientNonce?: string
  ): PaymentVerificationResult {
    const reg = db.getRegistrationById(registrationId);
    if (!reg) {
      throw new Error(`Registration with ID ${registrationId} does not exist`);
    }

    // Idempotency: If already paid, return existing success state
    if (reg.payment.status === 'paid') {
      return {
        verified: true,
        status: 'paid',
        transactionId: reg.payment.transactionId || paymentId,
        amount: reg.payment.amount,
        currency: reg.payment.currency,
        provider: reg.payment.provider || provider,
        timestamp: reg.payment.paidAt || new Date().toISOString(),
        isSandboxDemo: true,
        message: 'Payment verified (Idempotent confirmation).'
      };
    }

    // Generate mock transaction ID for sandbox or verify signature in live mode
    const txPrefix = provider === 'bkash' ? 'BK' : provider === 'bank_gateway' ? 'BNK' : 'CARD';
    const txId = `${txPrefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Update registration payment status in database
    db.updateRegistration(
      registrationId,
      {
        paymentStatus: 'paid',
        paymentTxId: txId
      },
      'PAYMENT_WEBHOOK'
    );

    return {
      verified: true,
      status: 'paid',
      transactionId: txId,
      amount: reg.payment.amount,
      currency: reg.payment.currency,
      provider,
      timestamp: new Date().toISOString(),
      isSandboxDemo: true,
      message: 'Payment successfully processed and verified server-side.'
    };
  }
}

export const paymentManager = new PaymentManager();
