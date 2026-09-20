import type { AppData } from '@/types';

export const DEFAULT_DATA: AppData = {
  teachers: [
    {
      id: 'teacher-1',
      name_bn: 'মাওলানা আব্দুর রহিম',
      name_en: 'Mawlana Abdur Rahim',
      qualification_bn: 'ফাজিল (অনার্স), কামিল (মাস্টার্স)',
      qualification_en: 'Fazil (Hons), Kamil (Masters)',
      mobile: '+8801700000001',
      email: 'abdurrahim@example.com',
      about_bn: 'মাওলানা আব্দুর রহিম দীর্ঘ ১৫ বছর ধরে ইসলামিক শিক্ষায় নিয়োজিত। তিনি কুরআন ও হাদিস বিষয়ে বিশেষ দক্ষতা রাখেন।',
      about_en: 'Mawlana Abdur Rahim has been engaged in Islamic education for 15 years. He has special expertise in Quran and Hadith.',
      photo: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'teacher-2',
      name_bn: 'মাওলানা মোহাম্মদ আলী',
      name_en: 'Mawlana Mohammad Ali',
      qualification_bn: 'ফাজিল (অনার্স), ডিআইইউ',
      qualification_en: 'Fazil (Hons), DIU',
      mobile: '+8801700000002',
      email: 'mohammadali@example.com',
      about_bn: 'মাওলানা মোহাম্মদ আলী আরবি ভাষা ও সাহিত্যে পারদর্শী। তিনি ১০ বছর ধরে শিক্ষকতা করছেন।',
      about_en: 'Mawlana Mohammad Ali is proficient in Arabic language and literature. He has been teaching for 10 years.',
      photo: '',
      createdAt: new Date().toISOString(),
    },
  ],
  classes: [
    { id: 'class-1', name_bn: 'ইবতেদায়ী (১ম)', name_en: 'Ibtedayi (1st)', order: 1 },
    { id: 'class-2', name_bn: 'ইবতেদায়ী (২য়)', name_en: 'Ibtedayi (2nd)', order: 2 },
    { id: 'class-3', name_bn: 'ইবতেদায়ী (৩য়)', name_en: 'Ibtedayi (3rd)', order: 3 },
    { id: 'class-4', name_bn: 'ইবতেদায়ী (৪র্থ)', name_en: 'Ibtedayi (4th)', order: 4 },
    { id: 'class-5', name_bn: 'ইবতেদায়ী (৫ম)', name_en: 'Ibtedayi (5th)', order: 5 },
    { id: 'class-6', name_bn: 'দাখিল (৬ষ্ঠ)', name_en: 'Dakhil (6th)', order: 6 },
    { id: 'class-7', name_bn: 'দাখিল (৭ম)', name_en: 'Dakhil (7th)', order: 7 },
    { id: 'class-8', name_bn: 'দাখিল (৮ম)', name_en: 'Dakhil (8th)', order: 8 },
    { id: 'class-9', name_bn: 'দাখিল (৯ম)', name_en: 'Dakhil (9th)', order: 9 },
    { id: 'class-10', name_bn: 'দাখিল (১০ম)', name_en: 'Dakhil (10th)', order: 10 },
    { id: 'class-11', name_bn: 'আলিম (১১শ)', name_en: 'Alim (11th)', order: 11 },
    { id: 'class-12', name_bn: 'আলিম (১২শ)', name_en: 'Alim (12th)', order: 12 },
    { id: 'class-13', name_bn: 'ফাজিল (১ম বর্ষ)', name_en: 'Fazil (1st Year)', order: 13 },
    { id: 'class-14', name_bn: 'ফাজিল (২য় বর্ষ)', name_en: 'Fazil (2nd Year)', order: 14 },
    { id: 'class-15', name_bn: 'ফাজিল (৩য় বর্ষ)', name_en: 'Fazil (3rd Year)', order: 15 },
  ],
  subjects: [
    { id: 'sub-1', name_bn: 'আল-কুরআন', name_en: 'Al-Quran', classId: '' },
    { id: 'sub-2', name_bn: 'আল-হাদিস', name_en: 'Al-Hadith', classId: '' },
    { id: 'sub-3', name_bn: 'আরবি', name_en: 'Arabic', classId: '' },
    { id: 'sub-4', name_bn: 'বাংলা', name_en: 'Bangla', classId: '' },
    { id: 'sub-5', name_bn: 'ইংরেজি', name_en: 'English', classId: '' },
    { id: 'sub-6', name_bn: 'গণিত', name_en: 'Mathematics', classId: '' },
    { id: 'sub-7', name_bn: 'ইসলাম শিক্ষা', name_en: 'Islamic Studies', classId: '' },
    { id: 'sub-8', name_bn: 'ফিকহ', name_en: 'Fiqh', classId: '' },
  ],
  results: [
    {
      id: 'result-1',
      studentName_bn: 'মোহাম্মদ রাফিউল ইসলাম',
      studentName_en: 'Mohammad Rafiul Islam',
      classId: 'class-10',
      className: 'দাখিল (১০ম)',
      roll: '101',
      entries: [
        { subject: 'আল-কুরআন', marks: 85, totalMarks: 100 },
        { subject: 'আরবি', marks: 78, totalMarks: 100 },
        { subject: 'বাংলা', marks: 82, totalMarks: 100 },
        { subject: 'ইংরেজি', marks: 70, totalMarks: 100 },
        { subject: 'গণিত', marks: 75, totalMarks: 100 },
      ],
      published: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'result-2',
      studentName_bn: 'ফাতেমা তুজ জোহরা',
      studentName_en: 'Fatema Tuj Zohra',
      classId: 'class-9',
      className: 'দাখিল (৯ম)',
      roll: '202',
      entries: [
        { subject: 'আল-কুরআন', marks: 90, totalMarks: 100 },
        { subject: 'আরবি', marks: 88, totalMarks: 100 },
        { subject: 'বাংলা', marks: 85, totalMarks: 100 },
        { subject: 'ইংরেজি', marks: 76, totalMarks: 100 },
        { subject: 'গণিত', marks: 80, totalMarks: 100 },
      ],
      published: true,
      createdAt: new Date().toISOString(),
    },
  ],
  notices: [],
  gallery: [
    {
      id: 'gallery-1',
      type: 'photo',
      title_bn: 'বার্ষিক পুরস্কার বিতরণী ২০২৪',
      title_en: 'Annual Prize Giving Ceremony 2024',
      url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=70',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'gallery-2',
      type: 'photo',
      title_bn: 'জাতীয় দিবস উদযাপন',
      title_en: 'National Day Celebration',
      url: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&q=70',
      createdAt: new Date().toISOString(),
    },
  ],
  complaints: [],
  madrasaInfo: {
    name_bn: 'গাজীরচট মদিনাতুল উলুম ফাজিল মাদ্রাসা',
    name_en: 'Gazirchat Madinatul Ulum Fazil Madrasa',
    logo: '',
    email: 'md108437@gmail.com',
    phone1: '+8801518734669',
    phone2: '+8801712822642',
    address_bn: 'মাদ্রাসা রোড, গাজী চট (বাইপাইল), আশুলিয়া, সাভার, ঢাকা।',
    address_en: 'Madrasa Road, Gazi Chat (Bipaile), Ashulia, Savar, Dhaka.',
    about_bn: 'গাজীরচট মদিনাতুল উলুম ফাজিল মাদ্রাসা বাংলাদেশের আশুলিয়া, সাভার, ঢাকায় অবস্থিত একটি ঐতিহ্যবাহী ইসলামিক শিক্ষা প্রতিষ্ঠান। এখানে ইবতেদায়ী থেকে ফাজিল স্তর পর্যন্ত শিক্ষার সুযোগ রয়েছে।',
    about_en: 'Gazirchat Madinatul Ulum Fazil Madrasa is a traditional Islamic educational institution located in Ashulia, Savar, Dhaka, Bangladesh. It offers education from Ibtedayi to Fazil level.',
    history_bn: 'মাদ্রাসাটি দীর্ঘদিন ধরে এই অঞ্চলে ইসলামিক শিক্ষার প্রসারে গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে। এলাকার সচেতন মুসলিম নাগরিকদের প্রচেষ্টায় এই মাদ্রাসা প্রতিষ্ঠিত হয়।',
    history_en: 'The madrasa has been playing an important role in spreading Islamic education in this region for a long time. It was established through the efforts of conscious Muslim citizens of the area.',
    mission_bn: 'কুরআন ও সুন্নাহর আলোকে নৈতিক ও মানবিক মূল্যবোধ সম্পন্ন আলেম তৈরি করা এবং দেশ ও জাতির কল্যাণে কাজ করা।',
    mission_en: 'To produce scholars with moral and human values in the light of Quran and Sunnah, and to work for the welfare of the country and nation.',
    vision_bn: 'ইসলামিক মূল্যবোধের সাথে আধুনিক জ্ঞানের সমন্বয়ে একটি আদর্শ শিক্ষা প্রতিষ্ঠান হিসেবে স্বীকৃতি অর্জন করা।',
    vision_en: 'To achieve recognition as an ideal educational institution by combining Islamic values with modern knowledge.',
    principalName_bn: 'মাওলানা (নাম)',
    principalName_en: 'Mawlana (Name)',
    principalMessage_bn: 'আমাদের মাদ্রাসায় আপনাকে স্বাগতম। আমরা বিশ্বাস করি যে ইসলামিক শিক্ষা মানুষের জীবনকে আলোকিত করে। আমাদের শিক্ষার্থীরা কুরআন ও সুন্নাহর শিক্ষায় দীক্ষিত হয়ে সমাজে কল্যাণকর ভূমিকা রাখবে।',
    principalMessage_en: 'Welcome to our Madrasa. We believe that Islamic education illuminates human life. Our students, educated in Quran and Sunnah, will play a beneficial role in society.',
    principalPhoto: '',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3647.9876543210987!2d90.3456789!3d23.8765432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUyJzM1LjYiTiA5MMKwMjAnNDQuNCJF!5e0!3m2!1sen!2sbd!4v1234567890',
    totalStudents: 0,
  },
  websiteSettings: {
    heroTitle_bn: 'গাজীরচট মদিনাতুল উলুম ফাজিল মাদ্রাসা',
    heroTitle_en: 'Gazirchat Madinatul Ulum Fazil Madrasa',
    heroSubtitle_bn: 'ইসলামিক শিক্ষার আলোকবর্তিকা — জ্ঞান, নৈতিকতা ও আধ্যাত্মিকতার পথে',
    heroSubtitle_en: 'Beacon of Islamic Education — On the Path of Knowledge, Ethics & Spirituality',
    heroBanner: '/hero-banner.jpg',
    footerText_bn: '© ২০২৪ গাজীরচট মদিনাতুল উলুম ফাজিল মাদ্রাসা। সর্বস্বত্ব সংরক্ষিত।',
    footerText_en: '© 2024 Gazirchat Madinatul Ulum Fazil Madrasa. All rights reserved.',
    facebookUrl: '',
    youtubeUrl: '',
    primaryColor: '#1a6b3c',
  },
  privacyPolicy_bn: `**গোপনীয়তা নীতি**

গাজীরচট মদিনাতুল উলুম ফাজিল মাদ্রাসা আপনার গোপনীয়তাকে সম্মান করে। এই গোপনীয়তা নীতিটি আমাদের ওয়েবসাইটের মাধ্যমে সংগ্রহ করা তথ্য কীভাবে ব্যবহার করা হয় তা ব্যাখ্যা করে।

**তথ্য সংগ্রহ:**
আমরা শুধুমাত্র যোগাযোগ ফর্ম ও অভিযোগ ফর্মের মাধ্যমে প্রয়োজনীয় তথ্য সংগ্রহ করি।

**তথ্যের ব্যবহার:**
সংগৃহীত তথ্য শুধুমাত্র আপনার সাথে যোগাযোগ ও অভিযোগ সমাধানের জন্য ব্যবহার করা হয়।

**তৃতীয় পক্ষের সাথে তথ্য শেয়ার:**
আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের সাথে শেয়ার করি না।`,
  privacyPolicy_en: `**Privacy Policy**

Gazirchat Madinatul Ulum Fazil Madrasa respects your privacy. This privacy policy explains how information collected through our website is used.

**Information Collection:**
We only collect necessary information through contact forms and complaint forms.

**Use of Information:**
Collected information is used only to communicate with you and resolve complaints.

**Sharing with Third Parties:**
We do not share your personal information with any third parties.`,
  termsConditions_bn: `**ব্যবহারের শর্তাবলী**

এই ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত শর্তগুলো মেনে চলতে সম্মত হচ্ছেন।

**ব্যবহারের অনুমতি:**
এই ওয়েবসাইটের তথ্য শুধুমাত্র ব্যক্তিগত ও অ-বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা যাবে।

**কন্টেন্ট:**
ওয়েবসাইটে প্রকাশিত সকল তথ্য মাদ্রাসা কর্তৃপক্ষের অনুমোদিত।

**পরিবর্তনের অধিকার:**
মাদ্রাসা কর্তৃপক্ষ যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখে।`,
  termsConditions_en: `**Terms and Conditions**

By using this website, you agree to comply with the following terms.

**Permission to Use:**
The information on this website may only be used for personal and non-commercial purposes.

**Content:**
All information published on the website is approved by the Madrasa authority.

**Right to Change:**
The Madrasa authority reserves the right to change these terms at any time.`,
  adminCredentials: {
    email: 'admin@madrasa.com',
    password: 'Admin@123',
  },
};
