export interface DivisionData {
  en: string;
  bn: string;
  districts: { en: string; bn: string }[];
}

export const bangladeshLocations: DivisionData[] = [
  {
    en: 'Dhaka',
    bn: 'ঢাকা',
    districts: [
      { en: 'Dhaka', bn: 'ঢাকা' },
      { en: 'Gazipur', bn: 'গাজীপুর' },
      { en: 'Narayanganj', bn: 'নারায়ণগঞ্জ' },
      { en: 'Tangail', bn: 'টাঙ্গাইল' },
      { en: 'Faridpur', bn: 'ফরিদপুর' },
      { en: 'Manikganj', bn: 'মানিকগঞ্জ' },
      { en: 'Munshiganj', bn: 'মুন্সীগঞ্জ' },
      { en: 'Narsingdi', bn: 'নরসিংদী' },
      { en: 'Kishoreganj', bn: 'কিশোরগঞ্জ' },
      { en: 'Gopalganj', bn: 'গোপালগঞ্জ' },
      { en: 'Madaripur', bn: 'মাদারীপুর' },
      { en: 'Rajbari', bn: 'রাজবাড়ী' },
      { en: 'Shariatpur', bn: 'শরীয়তপুর' },
    ]
  },
  {
    en: 'Chittagong',
    bn: 'চট্টগ্রাম',
    districts: [
      { en: 'Chittagong', bn: 'চট্টগ্রাম' },
      { en: 'Cox\'s Bazar', bn: 'কক্সবাজার' },
      { en: 'Comilla', bn: 'কুমিল্লা' },
      { en: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া' },
      { en: 'Chandpur', bn: 'চাঁদপুর' },
      { en: 'Feni', bn: 'ফেনী' },
      { en: 'Lakshmipur', bn: 'লক্ষ্মীপুর' },
      { en: 'Noakhali', bn: 'নোয়াখালী' },
      { en: 'Bandarban', bn: 'বান্দরবান' },
      { en: 'Rangamati', bn: 'রাঙ্গামাটি' },
      { en: 'Khagrachhari', bn: 'খাগড়াছড়ি' },
    ]
  },
  {
    en: 'Rajshahi',
    bn: 'রাজশাহী',
    districts: [
      { en: 'Rajshahi', bn: 'রাজশাহী' },
      { en: 'Bogra', bn: 'বগুড়া' },
      { en: 'Pabna', bn: 'পাবনা' },
      { en: 'Sirajganj', bn: 'সিরাজগঞ্জ' },
      { en: 'Natore', bn: 'নাটোর' },
      { en: 'Naogaon', bn: 'নওগাঁ' },
      { en: 'Chapai Nawabganj', bn: 'চাঁপাইনবাবগঞ্জ' },
      { en: 'Joypurhat', bn: 'জয়পুরহাট' },
    ]
  },
  {
    en: 'Khulna',
    bn: 'খুলনা',
    districts: [
      { en: 'Khulna', bn: 'খুলনা' },
      { en: 'Jessore', bn: 'যশোর' },
      { en: 'Satkhira', bn: 'সাতক্ষীরা' },
      { en: 'Kushtia', bn: 'কুষ্টিয়া' },
      { en: 'Jhenaidah', bn: 'ঝিনাইদহ' },
      { en: 'Bagerhat', bn: 'বাগেরহাট' },
      { en: 'Chuadanga', bn: 'চুয়াডাঙ্গা' },
      { en: 'Magura', bn: 'মাগুরা' },
      { en: 'Meherpur', bn: 'মেহেরপুর' },
      { en: 'Narail', bn: 'নড়াইল' },
    ]
  },
  {
    en: 'Sylhet',
    bn: 'সিলেট',
    districts: [
      { en: 'Sylhet', bn: 'সিলেট' },
      { en: 'Moulvibazar', bn: 'মৌলভীবাজার' },
      { en: 'Habiganj', bn: 'হবিগঞ্জ' },
      { en: 'Sunamganj', bn: 'সুনামগঞ্জ' },
    ]
  },
  {
    en: 'Barishal',
    bn: 'বরিশাল',
    districts: [
      { en: 'Barishal', bn: 'বরিশাল' },
      { en: 'Bhola', bn: 'ভোলা' },
      { en: 'Patuakhali', bn: 'পটুয়াখালী' },
      { en: 'Pirojpur', bn: 'পিরোজপুর' },
      { en: 'Jhalokati', bn: 'ঝালকাঠি' },
      { en: 'Barguna', bn: 'বরগুনা' },
    ]
  },
  {
    en: 'Rangpur',
    bn: 'রংপুর',
    districts: [
      { en: 'Rangpur', bn: 'রংপুর' },
      { en: 'Dinajpur', bn: 'দিনাজপুর' },
      { en: 'Gaibandha', bn: 'গাইবান্ধা' },
      { en: 'Kurigram', bn: 'কুড়িগ্রাম' },
      { en: 'Lalmonirhat', bn: 'লালমনিরহাট' },
      { en: 'Nilphamari', bn: 'নীলফামারী' },
      { en: 'Panchagarh', bn: 'পঞ্চগড়' },
      { en: 'Thakurgaon', bn: 'ঠাকুরগাঁও' },
    ]
  },
  {
    en: 'Mymensingh',
    bn: 'ময়মনসিংহ',
    districts: [
      { en: 'Mymensingh', bn: 'ময়মনসিংহ' },
      { en: 'Jamalpur', bn: 'জামালপুর' },
      { en: 'Netrokona', bn: 'নেত্রকোণা' },
      { en: 'Sherpur', bn: 'শেরপুর' },
    ]
  }
];
