export type Language = 'bn' | 'en';

export interface Teacher {
  id: string;
  name_bn: string;
  name_en: string;
  designation_bn: string;
  designation_en: string;
  qualification_bn: string;
  qualification_en: string;
  mobile: string;
  email: string;
  about_bn: string;
  about_en: string;
  photo: string;
  createdAt: string;
}

export interface ClassItem {
  id: string;
  name_bn: string;
  name_en: string;
  order: number;
}

export interface Subject {
  id: string;
  name_bn: string;
  name_en: string;
  classId: string;
}

export interface ResultEntry {
  subject: string;
  marks: number;
  totalMarks: number;
}

export interface Result {
  id: string;
  studentName_bn: string;
  studentName_en: string;
  classId: string;
  className: string;
  roll: string;
  entries: ResultEntry[];
  published: boolean;
  createdAt: string;
}

export interface Notice {
  id: string;
  title_bn: string;
  title_en: string;
  description_bn: string;
  description_en: string;
  date: string;
  attachment?: string;
  published: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  title_bn: string;
  title_en: string;
  url: string;
  thumbnail?: string;
  createdAt: string;
}

export type ComplaintStatus = 'pending' | 'under_review' | 'resolved' | 'rejected';
export type ComplaintType = 'student' | 'guardian';

export interface Complaint {
  id: string;
  trackingId: string;
  name: string;
  mobile: string;
  complaintType: ComplaintType;
  subject: string;
  message: string;
  status: ComplaintStatus;
  adminReply: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MadrasaInfo {
  name_bn: string;
  name_en: string;
  logo: string;
  email: string;
  phone1: string;
  phone2: string;
  address_bn: string;
  address_en: string;
  about_bn: string;
  about_en: string;
  history_bn: string;
  history_en: string;
  mission_bn: string;
  mission_en: string;
  vision_bn: string;
  vision_en: string;
  principalName_bn: string;
  principalName_en: string;
  principalMessage_bn: string;
  principalMessage_en: string;
  principalPhoto: string;
  mapEmbed: string;
  totalStudents: number;
  officeHours_bn: string;
  officeHours_en: string;
}

export interface WebsiteSettings {
  heroTitle_bn: string;
  heroTitle_en: string;
  heroSubtitle_bn: string;
  heroSubtitle_en: string;
  heroBanner: string;
  footerText_bn: string;
  footerText_en: string;
  facebookUrl: string;
  youtubeUrl: string;
  primaryColor: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AppData {
  teachers: Teacher[];
  classes: ClassItem[];
  subjects: Subject[];
  results: Result[];
  notices: Notice[];
  gallery: GalleryItem[];
  complaints: Complaint[];
  madrasaInfo: MadrasaInfo;
  websiteSettings: WebsiteSettings;
  privacyPolicy_bn: string;
  privacyPolicy_en: string;
  termsConditions_bn: string;
  termsConditions_en: string;
  adminCredentials: AdminCredentials;
}
