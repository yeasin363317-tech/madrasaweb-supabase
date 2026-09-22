import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { AppData, Teacher, ClassItem, Subject, Result, Notice, GalleryItem, Complaint, MadrasaInfo, WebsiteSettings, ComplaintStatus, ComplaintType } from '@/types';

// Defaults for single-row tables
const DEFAULT_MADRASA_INFO: MadrasaInfo = {
  name_bn: 'গাজীরচট মদিনাতুল উলুম ফাজিল মাদ্রাসা',
  name_en: 'Gazirchat Madinatul Ulum Fazil Madrasa',
  logo: '', email: 'md108437@gmail.com', phone1: '+8801518734669', phone2: '+8801712822642',
  address_bn: 'মাদ্রাসা রোড, গাজী চট (বাইপাইল), আশুলিয়া, সাভার, ঢাকা।',
  address_en: 'Madrasa Road, Gazi Chat (Bipaile), Ashulia, Savar, Dhaka.',
  about_bn: '', about_en: '', history_bn: '', history_en: '',
  mission_bn: '', mission_en: '', vision_bn: '', vision_en: '',
  principalName_bn: '', principalName_en: '',
  principalMessage_bn: '', principalMessage_en: '',
  principalPhoto: '', mapEmbed: '', totalStudents: 0,
  officeHours_bn: 'শনি–বৃহস্পতি: সকাল ৮টা – বিকাল ৪টা',
  officeHours_en: 'Sat–Thu: 8:00 AM – 4:00 PM',
};

const DEFAULT_SETTINGS: WebsiteSettings = {
  heroTitle_bn: 'গাজীরচট মদিনাতুল উলুম ফাজিল মাদ্রাসা',
  heroTitle_en: 'Gazirchat Madinatul Ulum Fazil Madrasa',
  heroSubtitle_bn: 'ইসলামিক শিক্ষার আলোকবর্তিকা',
  heroSubtitle_en: 'Beacon of Islamic Education',
  heroBanner: '/hero-banner.jpg',
  footerText_bn: '© ২০২৪ গাজীরচট মদিনাতুল উলুম ফাজিল মাদ্রাসা।',
  footerText_en: '© 2024 Gazirchat Madinatul Ulum Fazil Madrasa.',
  facebookUrl: '', youtubeUrl: '', primaryColor: '#1a6b3c',
};

const EMPTY_DATA: AppData = {
  teachers: [], classes: [], subjects: [], results: [],
  notices: [], gallery: [], complaints: [],
  madrasaInfo: DEFAULT_MADRASA_INFO,
  websiteSettings: DEFAULT_SETTINGS,
  privacyPolicy_bn: '', privacyPolicy_en: '',
  termsConditions_bn: '', termsConditions_en: '',
  adminCredentials: { email: '', password: '' },
};

// Row → App type converters
function rowToTeacher(r: Record<string, unknown>): Teacher {
  return {
    id: r.id as string, name_bn: r.name_bn as string, name_en: r.name_en as string,
    designation_bn: (r.designation_bn as string) || '',
    designation_en: (r.designation_en as string) || '',
    qualification_bn: r.qualification_bn as string, qualification_en: r.qualification_en as string,
    mobile: r.mobile as string, email: r.email as string,
    about_bn: r.about_bn as string, about_en: r.about_en as string,
    photo: r.photo as string, createdAt: r.created_at as string,
  };
}
function rowToClass(r: Record<string, unknown>): ClassItem {
  return { id: r.id as string, name_bn: r.name_bn as string, name_en: r.name_en as string, order: r.order as number };
}
function rowToSubject(r: Record<string, unknown>): Subject {
  return { id: r.id as string, name_bn: r.name_bn as string, name_en: r.name_en as string, classId: (r.class_id as string) || '' };
}
function rowToResult(r: Record<string, unknown>): Result {
  return {
    id: r.id as string, studentName_bn: r.student_name_bn as string, studentName_en: r.student_name_en as string,
    classId: (r.class_id as string) || '', className: r.class_name as string, roll: r.roll as string,
    entries: r.entries as Result['entries'], published: r.published as boolean, createdAt: r.created_at as string,
  };
}
function rowToNotice(r: Record<string, unknown>): Notice {
  return {
    id: r.id as string, title_bn: r.title_bn as string, title_en: r.title_en as string,
    description_bn: r.description_bn as string, description_en: r.description_en as string,
    date: r.date as string, attachment: (r.attachment as string) || '',
    published: r.published as boolean, createdAt: r.created_at as string,
  };
}
function rowToGallery(r: Record<string, unknown>): GalleryItem {
  return {
    id: r.id as string, type: r.type as 'photo' | 'video',
    title_bn: r.title_bn as string, title_en: r.title_en as string,
    url: r.url as string, thumbnail: (r.thumbnail as string) || '',
    createdAt: r.created_at as string,
  };
}
function rowToComplaint(r: Record<string, unknown>): Complaint {
  return {
    id: r.id as string,
    trackingId: (r.tracking_id as string) || '',
    name: r.name as string, mobile: r.mobile as string,
    complaintType: ((r.complaint_type as string) || 'student') as ComplaintType,
    subject: r.subject as string, message: r.message as string,
    status: ((r.status as string) || 'pending') as Complaint['status'],
    adminReply: (r.admin_reply as string) || '',
    resolved: r.resolved as boolean,
    createdAt: r.created_at as string,
    updatedAt: (r.updated_at as string) || r.created_at as string,
  };
}
function rowToMadrasaInfo(r: Record<string, unknown>): MadrasaInfo {
  return {
    name_bn: r.name_bn as string, name_en: r.name_en as string, logo: r.logo as string,
    email: r.email as string, phone1: r.phone1 as string, phone2: r.phone2 as string,
    address_bn: r.address_bn as string, address_en: r.address_en as string,
    about_bn: r.about_bn as string, about_en: r.about_en as string,
    history_bn: r.history_bn as string, history_en: r.history_en as string,
    mission_bn: r.mission_bn as string, mission_en: r.mission_en as string,
    vision_bn: r.vision_bn as string, vision_en: r.vision_en as string,
    principalName_bn: r.principal_name_bn as string, principalName_en: r.principal_name_en as string,
    principalMessage_bn: r.principal_message_bn as string, principalMessage_en: r.principal_message_en as string,
    principalPhoto: r.principal_photo as string, mapEmbed: r.map_embed as string,
    totalStudents: r.total_students as number,
    officeHours_bn: (r.office_hours_bn as string) || 'শনি–বৃহস্পতি: সকাল ৮টা – বিকাল ৪টা',
    officeHours_en: (r.office_hours_en as string) || 'Sat–Thu: 8:00 AM – 4:00 PM',
  };
}
function rowToSettings(r: Record<string, unknown>): WebsiteSettings {
  return {
    heroTitle_bn: r.hero_title_bn as string, heroTitle_en: r.hero_title_en as string,
    heroSubtitle_bn: r.hero_subtitle_bn as string, heroSubtitle_en: r.hero_subtitle_en as string,
    heroBanner: r.hero_banner as string,
    footerText_bn: r.footer_text_bn as string, footerText_en: r.footer_text_en as string,
    facebookUrl: r.facebook_url as string, youtubeUrl: r.youtube_url as string,
    primaryColor: r.primary_color as string,
  };
}

interface DataContextType {
  data: AppData;
  loading: boolean;
  dataReady: boolean;
  isAdmin: boolean;
  refreshData: () => Promise<void>;
  // Typed updaters for each section
  saveTeacher: (teacher: Teacher, isEdit: boolean) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  saveClass: (cls: ClassItem, isEdit: boolean) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  saveSubject: (sub: Subject, isEdit: boolean) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  saveResult: (result: Result, isEdit: boolean) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  toggleResultPublished: (id: string, published: boolean) => Promise<void>;
  setResultsPublished: (ids: string[], published: boolean) => Promise<void>;
  deleteResults: (ids: string[]) => Promise<void>;
  saveNotice: (notice: Notice, isEdit: boolean) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  toggleNoticePublished: (id: string, published: boolean) => Promise<void>;
  saveGalleryItem: (item: GalleryItem) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  saveComplaint: (complaint: { name: string; mobile: string; complaintType: ComplaintType; subject: string; message: string }) => Promise<{ trackingId: string }>;
  deleteComplaint: (id: string) => Promise<void>;
  toggleComplaintResolved: (id: string, resolved: boolean) => Promise<void>;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => Promise<void>;
  updateComplaintReply: (id: string, reply: string) => Promise<void>;
  saveMadrasaInfo: (info: MadrasaInfo) => Promise<void>;
  saveWebsiteSettings: (settings: WebsiteSettings) => Promise<void>;
  savePagesContent: (policyBn: string, policyEn: string, termsBn: string, termsEn: string) => Promise<void>;
  setAdminStatus: (val: boolean) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      // ── Phase 1: Critical data needed for initial render ──────────────────
      const [madrasaRes, settingsRes] = await Promise.all([
        supabase.from('madrasa_info').select('*').eq('id', 1).single(),
        supabase.from('website_settings').select('*').eq('id', 1).single(),
      ]);

      setData(prev => ({
        ...prev,
        madrasaInfo: madrasaRes.data ? rowToMadrasaInfo(madrasaRes.data as Record<string, unknown>) : DEFAULT_MADRASA_INFO,
        websiteSettings: settingsRes.data ? rowToSettings(settingsRes.data as Record<string, unknown>) : DEFAULT_SETTINGS,
      }));
      setLoading(false); // Unblock UI immediately after critical data

      // ── Phase 2: Secondary data — load in background ──────────────────────
      const [teachersRes, noticesRes, galleryRes, classesRes,
        subjectsRes, resultsRes, complaintsRes, pagesRes] = await Promise.all([
        supabase.from('teachers').select('*').order('created_at'),
        supabase.from('notices').select('*').order('date', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at'),
        supabase.from('classes').select('*').order('"order"'),
        supabase.from('subjects').select('*').order('created_at'),
        supabase.from('results').select('*').order('created_at'),
        supabase.from('complaints').select('*').order('created_at', { ascending: false }),
        supabase.from('pages_content').select('*').eq('id', 1).single(),
      ]);

      setData(prev => ({
        ...prev,
        teachers: (teachersRes.data || []).map(r => rowToTeacher(r as Record<string, unknown>)),
        notices: (noticesRes.data || []).map(r => rowToNotice(r as Record<string, unknown>)),
        gallery: (galleryRes.data || []).map(r => rowToGallery(r as Record<string, unknown>)),
        classes: (classesRes.data || []).map(r => rowToClass(r as Record<string, unknown>)),
        subjects: (subjectsRes.data || []).map(r => rowToSubject(r as Record<string, unknown>)),
        results: (resultsRes.data || []).map(r => rowToResult(r as Record<string, unknown>)),
        complaints: (complaintsRes.data || []).map(r => rowToComplaint(r as Record<string, unknown>)),
        privacyPolicy_bn: (pagesRes.data as Record<string, unknown>)?.privacy_policy_bn as string || '',
        privacyPolicy_en: (pagesRes.data as Record<string, unknown>)?.privacy_policy_en as string || '',
        termsConditions_bn: (pagesRes.data as Record<string, unknown>)?.terms_bn as string || '',
        termsConditions_en: (pagesRes.data as Record<string, unknown>)?.terms_en as string || '',
        adminCredentials: { email: '', password: '' },
      }));
      setDataReady(true);
    } catch (err) {
      console.error('Failed to load data:', err);
      setLoading(false);
      setDataReady(true);
    }
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  // Teachers
  const saveTeacher = useCallback(async (teacher: Teacher, isEdit: boolean) => {
    const row = {
      id: teacher.id, name_bn: teacher.name_bn, name_en: teacher.name_en,
      designation_bn: teacher.designation_bn, designation_en: teacher.designation_en,
      qualification_bn: teacher.qualification_bn, qualification_en: teacher.qualification_en,
      mobile: teacher.mobile, email: teacher.email,
      about_bn: teacher.about_bn, about_en: teacher.about_en, photo: teacher.photo,
    };
    if (isEdit) {
      const { error } = await supabase.from('teachers').update(row).eq('id', teacher.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('teachers').insert(row);
      if (error) throw error;
    }
    await refreshData();
  }, [refreshData]);

  const deleteTeacher = useCallback(async (id: string) => {
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  // Classes
  const saveClass = useCallback(async (cls: ClassItem, isEdit: boolean) => {
    const row = { id: cls.id, name_bn: cls.name_bn, name_en: cls.name_en, order: cls.order };
    if (isEdit) {
      const { error } = await supabase.from('classes').update(row).eq('id', cls.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('classes').insert(row);
      if (error) throw error;
    }
    await refreshData();
  }, [refreshData]);

  const deleteClass = useCallback(async (id: string) => {
    const { error } = await supabase.from('classes').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  // Subjects
  const saveSubject = useCallback(async (sub: Subject, isEdit: boolean) => {
    const row = { id: sub.id, name_bn: sub.name_bn, name_en: sub.name_en, class_id: sub.classId || null };
    if (isEdit) {
      const { error } = await supabase.from('subjects').update(row).eq('id', sub.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('subjects').insert(row);
      if (error) throw error;
    }
    await refreshData();
  }, [refreshData]);

  const deleteSubject = useCallback(async (id: string) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  // Results
  const saveResult = useCallback(async (result: Result, isEdit: boolean) => {
    const row = {
      id: result.id, student_name_bn: result.studentName_bn, student_name_en: result.studentName_en,
      class_id: result.classId || null, class_name: result.className, roll: result.roll,
      entries: result.entries, published: result.published,
    };
    if (isEdit) {
      const { error } = await supabase.from('results').update(row).eq('id', result.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('results').insert(row);
      if (error) throw error;
    }
    await refreshData();
  }, [refreshData]);

  const deleteResult = useCallback(async (id: string) => {
    const { error } = await supabase.from('results').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  // Bulk publish / unpublish. Uses one query per chunk and VERIFIES how many rows were really updated,
  // because Postgres RLS silently updates 0 rows (no error) when the login session has expired.
  const setResultsPublished = useCallback(async (ids: string[], published: boolean) => {
    if (ids.length === 0) return;
    const done = new Set<string>();
    for (let i = 0; i < ids.length; i += 80) {
      const chunk = ids.slice(i, i + 80);
      const { data: updated, error } = await supabase
        .from('results').update({ published }).in('id', chunk).select('id');
      if (error) throw error;
      (updated || []).forEach(r => done.add(r.id as string));
    }
    setData(prev => ({ ...prev, results: prev.results.map(r => done.has(r.id) ? { ...r, published } : r) }));
    if (done.size !== ids.length) {
      throw new Error(
        done.size === 0
          ? 'কোনো ফলাফল আপডেট হয়নি। লগইন সেশন শেষ হয়ে থাকতে পারে — আবার লগইন করুন। (Nothing updated — please login again)'
          : `${ids.length} টির মধ্যে মাত্র ${done.size} টি আপডেট হয়েছে। (Only ${done.size} of ${ids.length} updated)`
      );
    }
  }, []);

  const toggleResultPublished = useCallback(
    (id: string, published: boolean) => setResultsPublished([id], published),
    [setResultsPublished]
  );

  const deleteResults = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;
    const removed = new Set<string>();
    for (let i = 0; i < ids.length; i += 80) {
      const chunk = ids.slice(i, i + 80);
      const { data: deleted, error } = await supabase.from('results').delete().in('id', chunk).select('id');
      if (error) throw error;
      (deleted || []).forEach(r => removed.add(r.id as string));
    }
    setData(prev => ({ ...prev, results: prev.results.filter(r => !removed.has(r.id)) }));
    if (removed.size !== ids.length) throw new Error(`${ids.length} টির মধ্যে ${removed.size} টি মুছেছে। লগইন সেশন চেক করুন।`);
  }, []);

  // Notices
  const saveNotice = useCallback(async (notice: Notice, isEdit: boolean) => {
    const row = {
      id: notice.id, title_bn: notice.title_bn, title_en: notice.title_en,
      description_bn: notice.description_bn, description_en: notice.description_en,
      date: notice.date, attachment: notice.attachment || '', published: notice.published,
    };
    if (isEdit) {
      const { error } = await supabase.from('notices').update(row).eq('id', notice.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('notices').insert(row);
      if (error) throw error;
    }
    await refreshData();
  }, [refreshData]);

  const deleteNotice = useCallback(async (id: string) => {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  const toggleNoticePublished = useCallback(async (id: string, published: boolean) => {
    const { error } = await supabase.from('notices').update({ published }).eq('id', id);
    if (error) throw error;
    setData(prev => ({ ...prev, notices: prev.notices.map(n => n.id === id ? { ...n, published } : n) }));
  }, []);

  // Gallery
  const saveGalleryItem = useCallback(async (item: GalleryItem) => {
    const row = {
      id: item.id, type: item.type, title_bn: item.title_bn, title_en: item.title_en,
      url: item.url, thumbnail: item.thumbnail || '',
    };
    const { error } = await supabase.from('gallery').insert(row);
    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  const deleteGalleryItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  // Complaints
  const saveComplaint = useCallback(async (complaint: { name: string; mobile: string; complaintType: ComplaintType; subject: string; message: string }) => {
    // Use the record ID itself as the tracking ID
    const id = `c-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const { error } = await supabase.from('complaints').insert({
      id,
      tracking_id: id,
      name: complaint.name,
      mobile: complaint.mobile,
      complaint_type: complaint.complaintType,
      subject: complaint.subject,
      message: complaint.message,
      resolved: false,
      status: 'pending',
      admin_reply: '',
    });
    if (error) throw error;
    await refreshData();
    return { trackingId: id };
  }, [refreshData]);

  const deleteComplaint = useCallback(async (id: string) => {
    const { error } = await supabase.from('complaints').delete().eq('id', id);
    if (error) throw error;
    await refreshData();
  }, [refreshData]);

  const toggleComplaintResolved = useCallback(async (id: string, resolved: boolean) => {
    const newStatus = resolved ? 'resolved' : 'pending';
    const { error } = await supabase.from('complaints').update({ resolved, status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    setData(prev => ({ ...prev, complaints: prev.complaints.map(c => c.id === id ? { ...c, resolved, status: newStatus as ComplaintStatus } : c) }));
  }, []);

  const updateComplaintStatus = useCallback(async (id: string, status: ComplaintStatus) => {
    const resolved = status === 'resolved';
    const { error } = await supabase.from('complaints').update({ status, resolved, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    setData(prev => ({ ...prev, complaints: prev.complaints.map(c => c.id === id ? { ...c, status, resolved } : c) }));
  }, []);

  const updateComplaintReply = useCallback(async (id: string, reply: string) => {
    const { error } = await supabase.from('complaints').update({ admin_reply: reply, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    setData(prev => ({ ...prev, complaints: prev.complaints.map(c => c.id === id ? { ...c, adminReply: reply } : c) }));
  }, []);

  // Madrasa Info
  const saveMadrasaInfo = useCallback(async (info: MadrasaInfo) => {
    const row = {
      name_bn: info.name_bn, name_en: info.name_en, logo: info.logo,
      email: info.email, phone1: info.phone1, phone2: info.phone2,
      address_bn: info.address_bn, address_en: info.address_en,
      about_bn: info.about_bn, about_en: info.about_en,
      history_bn: info.history_bn, history_en: info.history_en,
      mission_bn: info.mission_bn, mission_en: info.mission_en,
      vision_bn: info.vision_bn, vision_en: info.vision_en,
      principal_name_bn: info.principalName_bn, principal_name_en: info.principalName_en,
      principal_message_bn: info.principalMessage_bn, principal_message_en: info.principalMessage_en,
      principal_photo: info.principalPhoto, map_embed: info.mapEmbed,
      total_students: info.totalStudents,
      office_hours_bn: info.officeHours_bn,
      office_hours_en: info.officeHours_en,
    };
    const { error } = await supabase.from('madrasa_info').upsert({ id: 1, ...row });
    if (error) throw error;
    setData(prev => ({ ...prev, madrasaInfo: info }));
  }, []);

  // Website Settings
  const saveWebsiteSettings = useCallback(async (settings: WebsiteSettings) => {
    const row = {
      hero_title_bn: settings.heroTitle_bn, hero_title_en: settings.heroTitle_en,
      hero_subtitle_bn: settings.heroSubtitle_bn, hero_subtitle_en: settings.heroSubtitle_en,
      hero_banner: settings.heroBanner, footer_text_bn: settings.footerText_bn,
      footer_text_en: settings.footerText_en, facebook_url: settings.facebookUrl,
      youtube_url: settings.youtubeUrl, primary_color: settings.primaryColor,
    };
    const { error } = await supabase.from('website_settings').upsert({ id: 1, ...row });
    if (error) throw error;
    setData(prev => ({ ...prev, websiteSettings: settings }));
  }, []);

  // Pages Content
  const savePagesContent = useCallback(async (policyBn: string, policyEn: string, termsBn: string, termsEn: string) => {
    const { error } = await supabase.from('pages_content').upsert({
      id: 1, privacy_policy_bn: policyBn, privacy_policy_en: policyEn,
      terms_bn: termsBn, terms_en: termsEn,
    });
    if (error) throw error;
    setData(prev => ({ ...prev, privacyPolicy_bn: policyBn, privacyPolicy_en: policyEn, termsConditions_bn: termsBn, termsConditions_en: termsEn }));
  }, []);

  const setAdminStatus = useCallback((val: boolean) => setIsAdmin(val), []);

  return (
    <DataContext.Provider value={{
      data, loading, dataReady, isAdmin,
      refreshData, setAdminStatus,
      saveTeacher, deleteTeacher,
      saveClass, deleteClass,
      saveSubject, deleteSubject,
      saveResult, deleteResult, toggleResultPublished, setResultsPublished, deleteResults,
      saveNotice, deleteNotice, toggleNoticePublished,
      saveGalleryItem, deleteGalleryItem,
      saveComplaint, deleteComplaint, toggleComplaintResolved,
      updateComplaintStatus, updateComplaintReply,
      saveMadrasaInfo, saveWebsiteSettings, savePagesContent,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
