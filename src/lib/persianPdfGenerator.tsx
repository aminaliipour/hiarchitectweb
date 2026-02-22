import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';

// Register Persian fonts
Font.register({
  family: 'Vazir',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Bold.ttf',
      fontWeight: 700,
    },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Vazir',
    fontSize: 11,
    padding: 30,
    direction: 'rtl',
    textAlign: 'right',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  section: {
    marginBottom: 20, // فاصله بیشتر بین بخش‌ها
    direction: 'rtl',
    padding: 10, // padding داخلی برای بخش‌ها
    backgroundColor: '#f8f9fa', // پس‌زمینه ملایم
    borderRadius: 5, // گوشه‌های گرد
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12, // فاصله بیشتر زیر عنوان
    color: '#34495e',
    borderBottom: '2 solid #3498db',
    paddingBottom: 6, // padding بیشتر زیر عنوان
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row-reverse', 
    marginBottom: 8,
    alignItems: 'flex-start',
    paddingVertical: 4,
    borderBottom: '0.5 solid #ecf0f1',
  },
  label: {
    width: '40%', 
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingRight: 8, 
    textAlign: 'right', 
    fontSize: 10,
  },
  value: {
    width: '60%', 
    color: '#34495e',
    textAlign: 'right', 
    paddingLeft: 8,
    fontSize: 10,
    lineHeight: 1.4,
  },
  longText: {
    marginTop: 8,
    lineHeight: 1.6,
    color: '#34495e',
    textAlign: 'right',
    direction: 'rtl',
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#7f8c8d',
    direction: 'rtl', // راست‌چینی فوتر
  },
});

interface RegistrationData {
  id: string | number;
  full_name?: string;
  birth_date?: string;
  national_id?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  education_level?: string;
  field_of_study?: string;
  university?: string;
  graduation_year?: string;
  gpa?: string;
  work_experience_years?: string;
  current_position?: string;
  preferred_position?: string;
  salary_expectation?: string;
  availability_date?: string;
  work_schedule_preference?: string;
  skills?: string | any[];
  software_proficiency?: string | any[];
  languages?: string | any[];
  has_portfolio?: boolean;
  portfolio_url?: string;
  cover_letter?: string;
  additional_notes?: string;
  why_join_company?: string;
  career_goal?: string;
  digital_interests?: string | any[];
  first_salary_plan?: string;
  shopping_preference?: string;
  attractive_traits?: string | any[];
  mountain_path_choice?: string;
  free_time_activity?: string;
  work_mistake_reaction?: string;
  soup_preference?: string;
  workspace_cleanliness?: string;
  previous_work_environment?: string;
  colleague_problem_help?: string;
  colleague_oversight?: string;
  overtime_request_reaction?: string;
  rejection_reaction?: string;
  worst_work_day?: string;
  best_work_day?: string;
  biggest_work_challenge?: string;
  what_motivates?: string;
  personal_strengths?: string;
  criticism_opinion?: string;
  teamwork_budget?: string;
  improvement_suggestion?: string;
  group_criticism?: string;
  group_management?: string;
  employment_reason?: string;
  goals_and_plans?: string;
  customer_service?: string;
  salary_choice?: string;
  company_research?: string;
  skill_opinion?: string;
  created_at?: string;
  status?: string;
}

const parseField = (field: any): string => {
  if (!field) return '-';
  if (Array.isArray(field)) return field.join('، ');
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed.join('، ') : parsed.toString();
    } catch {
      return field;
    }
  }
  return field.toString();
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fa-IR');
  } catch {
    return dateString;
  }
};

const FieldRow: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{parseField(value)}</Text>
  </View>
);

const RegistrationPDF: React.FC<{ data: RegistrationData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>فرم ثبت نام متقاضی</Text>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>اطلاعات شخصی</Text>
        <FieldRow label="نام و نام خانوادگی" value={data.full_name} />
        <FieldRow label="کد ملی" value={data.national_id} />
        <FieldRow label="تاریخ تولد" value={formatDate(data.birth_date)} />
        <FieldRow label="تلفن" value={data.phone} />
        <FieldRow label="موبایل" value={data.mobile} />
        <FieldRow label="ایمیل" value={data.email} />
        <FieldRow label="آدرس" value={data.address} />
      </View>

      {/* Education */}
      {(data.education_level || data.field_of_study || data.university) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اطلاعات تحصیلی</Text>
          <FieldRow label="سطح تحصیلات" value={data.education_level} />
          <FieldRow label="رشته تحصیلی" value={data.field_of_study} />
          <FieldRow label="دانشگاه" value={data.university} />
          <FieldRow label="سال فارغ‌التحصیلی" value={data.graduation_year} />
          <FieldRow label="معدل" value={data.gpa} />
        </View>
      )}

      {/* Work Experience */}
      {(data.work_experience_years || data.current_position) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>سوابق کاری</Text>
          <FieldRow label="سال‌های تجربه" value={data.work_experience_years} />
          <FieldRow label="موقعیت فعلی" value={data.current_position} />
        </View>
      )}

      {/* Skills */}
      {(data.skills || data.software_proficiency || data.languages) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مهارت‌ها و زبان‌ها</Text>
          {data.skills && <FieldRow label="مهارت‌ها" value={data.skills} />}
          {data.software_proficiency && <FieldRow label="نرم‌افزارها" value={data.software_proficiency} />}
          {data.languages && <FieldRow label="زبان‌ها" value={data.languages} />}
        </View>
      )}

      {/* Career Preferences */}
      {(data.preferred_position || data.salary_expectation) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ترجیحات شغلی</Text>
          <FieldRow label="موقعیت مورد نظر" value={data.preferred_position} />
          <FieldRow label="انتظار حقوق" value={data.salary_expectation} />
          <FieldRow label="تاریخ شروع کار" value={formatDate(data.availability_date)} />
          <FieldRow label="ترجیح ساعت کاری" value={data.work_schedule_preference} />
        </View>
      )}

      {/* Portfolio */}
      {data.has_portfolio && data.portfolio_url && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>نمونه کار</Text>
          <FieldRow label="آدرس نمونه کار" value={data.portfolio_url} />
        </View>
      )}

      {/* Cover Letter */}
      {data.cover_letter && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>نامه انگیزه</Text>
          <Text style={styles.longText}>{data.cover_letter}</Text>
        </View>
      )}

      {/* Footer */}
      <Text style={styles.footer}>
        تاریخ تولید: {new Date().toLocaleDateString('fa-IR')} | 
        شناسه: {data.id} | 
        وضعیت: {data.status || 'نامشخص'}
      </Text>
    </Page>

    {/* Second Page for Extended Questions */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>سوالات تکمیلی و رفتاری</Text>

      {/* Extended Questions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>سوالات تکمیلی</Text>
        {data.why_join_company && <FieldRow label="دلیل پیوستن به شرکت" value={data.why_join_company} />}
        {data.career_goal && <FieldRow label="هدف شغلی" value={data.career_goal} />}
        {data.criticism_opinion && <FieldRow label="نظر درباره انتقاد" value={data.criticism_opinion} />}
        {data.teamwork_budget && <FieldRow label="بودجه کار تیمی" value={data.teamwork_budget} />}
        {data.improvement_suggestion && <FieldRow label="پیشنهاد بهبود" value={data.improvement_suggestion} />}
        {data.group_criticism && <FieldRow label="انتقاد گروهی" value={data.group_criticism} />}
        {data.group_management && <FieldRow label="مدیریت گروه" value={data.group_management} />}
        {data.employment_reason && <FieldRow label="دلیل استخدام" value={data.employment_reason} />}
        {data.goals_and_plans && <FieldRow label="اهداف و برنامه‌ها" value={data.goals_and_plans} />}
        {data.customer_service && <FieldRow label="خدمات مشتری" value={data.customer_service} />}
        {data.company_research && <FieldRow label="تحقیق درباره شرکت" value={data.company_research} />}
        {data.skill_opinion && <FieldRow label="نظر درباره مهارت" value={data.skill_opinion} />}
      </View>

      {/* Behavioral Questions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>سوالات رفتاری</Text>
        {data.digital_interests && <FieldRow label="علایق دیجیتال" value={data.digital_interests} />}
        {data.first_salary_plan && <FieldRow label="برنامه اولین حقوق" value={data.first_salary_plan} />}
        {data.shopping_preference && <FieldRow label="ترجیح خرید" value={data.shopping_preference} />}
        {data.attractive_traits && <FieldRow label="ویژگی‌های جذاب" value={data.attractive_traits} />}
        {data.mountain_path_choice && <FieldRow label="انتخاب مسیر کوهستانی" value={data.mountain_path_choice} />}
        {data.free_time_activity && <FieldRow label="فعالیت اوقات فراغت" value={data.free_time_activity} />}
        {data.work_mistake_reaction && <FieldRow label="واکنش به اشتباه کاری" value={data.work_mistake_reaction} />}
        {data.soup_preference && <FieldRow label="ترجیح سوپ" value={data.soup_preference} />}
        {data.workspace_cleanliness && <FieldRow label="نظافت محیط کار" value={data.workspace_cleanliness} />}
        {data.previous_work_environment && <FieldRow label="محیط کار قبلی" value={data.previous_work_environment} />}
        {data.colleague_problem_help && <FieldRow label="کمک به همکار" value={data.colleague_problem_help} />}
        {data.colleague_oversight && <FieldRow label="نظارت بر همکار" value={data.colleague_oversight} />}
        {data.overtime_request_reaction && <FieldRow label="واکنش به اضافه‌کاری" value={data.overtime_request_reaction} />}
        {data.rejection_reaction && <FieldRow label="واکنش به رد شدن" value={data.rejection_reaction} />}
      </View>

      {/* Personal Reflection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>تأملات شخصی</Text>
        {data.worst_work_day && <FieldRow label="بدترین روز کاری" value={data.worst_work_day} />}
        {data.best_work_day && <FieldRow label="بهترین روز کاری" value={data.best_work_day} />}
        {data.biggest_work_challenge && <FieldRow label="بزرگترین چالش کاری" value={data.biggest_work_challenge} />}
        {data.what_motivates && <FieldRow label="انگیزه‌دهنده‌ها" value={data.what_motivates} />}
        {data.personal_strengths && <FieldRow label="نقاط قوت شخصی" value={data.personal_strengths} />}
      </View>

      {/* Additional Notes */}
      {data.additional_notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>توضیحات اضافی</Text>
          <Text style={styles.longText}>{data.additional_notes}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export async function generatePersianPDF(data: RegistrationData): Promise<ArrayBuffer> {
  const doc = <RegistrationPDF data={data} />;
  const pdfBlob = await pdf(doc).toBlob();
  return await pdfBlob.arrayBuffer();
}

export type { RegistrationData };