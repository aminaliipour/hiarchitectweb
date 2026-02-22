import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface RegistrationData {
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

export class PDFGenerator {
  private doc: jsPDF;
  private yPosition: number;
  private margin: number = 20;
  private pageHeight: number;
  private lineHeight: number = 7;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.yPosition = this.margin;
  }

  private addTitle(title: string, fontSize: number = 16) {
    this.checkPageBreak(20);
    this.doc.setFontSize(fontSize);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, this.yPosition);
    this.yPosition += 15;
  }

  private addSubtitle(subtitle: string) {
    this.checkPageBreak(15);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(subtitle, this.margin, this.yPosition);
    this.yPosition += 10;
  }

  private addTable(headers: string[], data: string[][]) {
    this.checkPageBreak(30);
    
    autoTable(this.doc, {
      startY: this.yPosition,
      head: [headers],
      body: data,
      theme: 'striped',
      headStyles: { 
        fillColor: [52, 152, 219],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      styles: { 
        font: 'helvetica', 
        fontSize: 10,
        cellPadding: 5,
        overflow: 'linebreak',
        halign: 'right'
      },
      columnStyles: { 
        0: { cellWidth: 50, fontStyle: 'bold' }, 
        1: { cellWidth: 120 } 
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data: any) => {
        // Reset yPosition after page break
        this.yPosition = data.cursor?.y || this.margin;
      }
    });
    
    this.yPosition = (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addText(text: string, maxWidth: number = 170) {
    if (!text || text.trim() === '') return;
    
    this.checkPageBreak(20);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    
    const lines = this.doc.splitTextToSize(text, maxWidth);
    this.doc.text(lines, this.margin, this.yPosition);
    this.yPosition += lines.length * this.lineHeight + 5;
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.yPosition + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.yPosition = this.margin;
    }
  }

  private parseJsonField(field: string | any[] | undefined): string {
    if (!field) return '-';
    
    // If already an array, join directly
    if (Array.isArray(field)) {
      return field.join(', ');
    }
    
    // If string, try to parse as JSON
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        if (Array.isArray(parsed)) {
          return parsed.join(', ');
        }
        return parsed.toString();
      } catch {
        return field;
      }
    }
    
    // For other types, convert to string
    return String(field);
  }

  private formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fa-IR');
    } catch {
      return dateString;
    }
  }

  generatePDF(registration: RegistrationData): ArrayBuffer {
    // Header
    this.doc.setFontSize(20);
    this.doc.setFont("helvetica", "bold");
    this.doc.text('Registration Form / فرم ثبت نام', this.doc.internal.pageSize.width / 2, this.yPosition, { align: 'center' });
    this.yPosition += 25;

    // Personal Information
    this.addSubtitle('Personal Information / اطلاعات شخصی');
    const personalData = [
      ['Full Name / نام کامل', registration.full_name || '-'],
      ['National ID / کد ملی', registration.national_id || '-'],
      ['Birth Date / تاریخ تولد', this.formatDate(registration.birth_date)],
      ['Phone / تلفن', registration.phone || '-'],
      ['Mobile / موبایل', registration.mobile || '-'],
      ['Email / ایمیل', registration.email || '-'],
      ['Address / آدرس', registration.address || '-'],
    ];
    this.addTable(['Field / فیلد', 'Value / مقدار'], personalData);

    // Education Information
    if (registration.education_level || registration.field_of_study || registration.university) {
      this.addSubtitle('Education Information / اطلاعات تحصیلی');
      const educationData = [
        ['Education Level / سطح تحصیلات', registration.education_level || '-'],
        ['Field of Study / رشته تحصیلی', registration.field_of_study || '-'],
        ['University / دانشگاه', registration.university || '-'],
        ['Graduation Year / سال فارغ‌التحصیلی', registration.graduation_year || '-'],
        ['GPA / معدل', registration.gpa || '-'],
      ];
      this.addTable(['Field / فیلد', 'Value / مقدار'], educationData);
    }

    // Work Experience
    if (registration.work_experience_years || registration.current_position) {
      this.addSubtitle('Work Experience / سوابق کاری');
      const workData = [
        ['Years of Experience / سال‌های تجربه', registration.work_experience_years || '-'],
        ['Current Position / موقعیت فعلی', registration.current_position || '-'],
      ];
      this.addTable(['Field / فیلد', 'Value / مقدار'], workData);
    }

    // Skills and Languages
    if (registration.skills || registration.software_proficiency || registration.languages) {
      this.addSubtitle('Skills and Languages / مهارت‌ها و زبان‌ها');
      const skillsData = [];
      
      if (registration.skills) {
        skillsData.push(['Skills / مهارت‌ها', this.parseJsonField(registration.skills)]);
      }
      if (registration.software_proficiency) {
        skillsData.push(['Software Proficiency / مهارت نرم‌افزاری', this.parseJsonField(registration.software_proficiency)]);
      }
      if (registration.languages) {
        skillsData.push(['Languages / زبان‌ها', this.parseJsonField(registration.languages)]);
      }
      
      if (skillsData.length > 0) {
        this.addTable(['Field / فیلد', 'Value / مقدار'], skillsData);
      }
    }

    // Career Preferences
    if (registration.preferred_position || registration.salary_expectation) {
      this.addSubtitle('Career Preferences / ترجیحات شغلی');
      const careerData = [
        ['Preferred Position / موقعیت مورد نظر', registration.preferred_position || '-'],
        ['Salary Expectation / انتظار حقوق', registration.salary_expectation || '-'],
        ['Availability Date / تاریخ شروع کار', this.formatDate(registration.availability_date)],
        ['Work Schedule Preference / ترجیح ساعت کاری', registration.work_schedule_preference || '-'],
      ];
      this.addTable(['Field / فیلد', 'Value / مقدار'], careerData);
    }

    // Portfolio
    if (registration.has_portfolio && registration.portfolio_url) {
      this.addSubtitle('Portfolio / نمونه کار');
      const portfolioData = [
        ['Portfolio URL / لینک نمونه کار', registration.portfolio_url || '-'],
      ];
      this.addTable(['Field / فیلد', 'Value / مقدار'], portfolioData);
    }

    // Cover Letter
    if (registration.cover_letter) {
      this.addSubtitle('Cover Letter / نامه انگیزه');
      this.addText(registration.cover_letter);
    }

    // Extended Questions
    const extendedQuestions = [];
    if (registration.why_join_company) {
      extendedQuestions.push(['Why join our company? / چرا به شرکت ما بپیوندید؟', registration.why_join_company]);
    }
    if (registration.career_goal) {
      extendedQuestions.push(['Career Goal / هدف شغلی', registration.career_goal]);
    }
    if (registration.criticism_opinion) {
      extendedQuestions.push(['Opinion on Criticism / نظر درباره انتقاد', registration.criticism_opinion]);
    }
    if (registration.teamwork_budget) {
      extendedQuestions.push(['Teamwork Budget / بودجه کار تیمی', registration.teamwork_budget]);
    }
    if (registration.improvement_suggestion) {
      extendedQuestions.push(['Improvement Suggestion / پیشنهاد بهبود', registration.improvement_suggestion]);
    }
    if (registration.group_criticism) {
      extendedQuestions.push(['Group Criticism / انتقاد گروهی', registration.group_criticism]);
    }
    if (registration.group_management) {
      extendedQuestions.push(['Group Management / مدیریت گروه', registration.group_management]);
    }
    if (registration.employment_reason) {
      extendedQuestions.push(['Employment Reason / دلیل استخدام', registration.employment_reason]);
    }
    if (registration.goals_and_plans) {
      extendedQuestions.push(['Goals and Plans / اهداف و برنامه‌ها', registration.goals_and_plans]);
    }
    if (registration.customer_service) {
      extendedQuestions.push(['Customer Service / خدمات مشتری', registration.customer_service]);
    }
    if (registration.company_research) {
      extendedQuestions.push(['Company Research / تحقیق درباره شرکت', registration.company_research]);
    }
    if (registration.skill_opinion) {
      extendedQuestions.push(['Skill Opinion / نظر درباره مهارت', registration.skill_opinion]);
    }

    if (extendedQuestions.length > 0) {
      this.addSubtitle('Extended Questions / سوالات تکمیلی');
      this.addTable(['Question / سوال', 'Answer / پاسخ'], extendedQuestions);
    }

    // Behavioral Assessment
    const behavioralQuestions = [];
    if (registration.digital_interests) {
      behavioralQuestions.push(['Digital Interests / علایق دیجیتال', this.parseJsonField(registration.digital_interests)]);
    }
    if (registration.first_salary_plan) {
      behavioralQuestions.push(['First Salary Plan / برنامه اولین حقوق', registration.first_salary_plan]);
    }
    if (registration.shopping_preference) {
      behavioralQuestions.push(['Shopping Preference / ترجیح خرید', registration.shopping_preference]);
    }
    if (registration.attractive_traits) {
      behavioralQuestions.push(['Attractive Traits / ویژگی‌های جذاب', this.parseJsonField(registration.attractive_traits)]);
    }
    if (registration.mountain_path_choice) {
      behavioralQuestions.push(['Mountain Path Choice / انتخاب مسیر کوهستانی', registration.mountain_path_choice]);
    }
    if (registration.free_time_activity) {
      behavioralQuestions.push(['Free Time Activity / فعالیت اوقات فراغت', registration.free_time_activity]);
    }
    if (registration.work_mistake_reaction) {
      behavioralQuestions.push(['Work Mistake Reaction / واکنش به اشتباه کاری', registration.work_mistake_reaction]);
    }
    if (registration.soup_preference) {
      behavioralQuestions.push(['Soup Preference / ترجیح سوپ', registration.soup_preference]);
    }
    if (registration.workspace_cleanliness) {
      behavioralQuestions.push(['Workspace Cleanliness / نظافت محیط کار', registration.workspace_cleanliness]);
    }
    if (registration.previous_work_environment) {
      behavioralQuestions.push(['Previous Work Environment / محیط کار قبلی', registration.previous_work_environment]);
    }
    if (registration.colleague_problem_help) {
      behavioralQuestions.push(['Colleague Problem Help / کمک به مشکل همکار', registration.colleague_problem_help]);
    }
    if (registration.colleague_oversight) {
      behavioralQuestions.push(['Colleague Oversight / نظارت بر همکار', registration.colleague_oversight]);
    }
    if (registration.overtime_request_reaction) {
      behavioralQuestions.push(['Overtime Request Reaction / واکنش به درخواست اضافه‌کاری', registration.overtime_request_reaction]);
    }
    if (registration.rejection_reaction) {
      behavioralQuestions.push(['Rejection Reaction / واکنش به رد شدن', registration.rejection_reaction]);
    }

    if (behavioralQuestions.length > 0) {
      this.addSubtitle('Behavioral Assessment / ارزیابی رفتاری');
      this.addTable(['Question / سوال', 'Answer / پاسخ'], behavioralQuestions);
    }

    // Personal Reflection
    const personalReflection = [];
    if (registration.worst_work_day) {
      personalReflection.push(['Worst Work Day / بدترین روز کاری', registration.worst_work_day]);
    }
    if (registration.best_work_day) {
      personalReflection.push(['Best Work Day / بهترین روز کاری', registration.best_work_day]);
    }
    if (registration.biggest_work_challenge) {
      personalReflection.push(['Biggest Work Challenge / بزرگترین چالش کاری', registration.biggest_work_challenge]);
    }
    if (registration.what_motivates) {
      personalReflection.push(['What Motivates You / چه چیزی شما را انگیزه می‌دهد', registration.what_motivates]);
    }
    if (registration.personal_strengths) {
      personalReflection.push(['Personal Strengths / نقاط قوت شخصی', registration.personal_strengths]);
    }

    if (personalReflection.length > 0) {
      this.addSubtitle('Personal Reflection / تأملات شخصی');
      this.addTable(['Question / سوال', 'Answer / پاسخ'], personalReflection);
    }

    // Additional Notes
    if (registration.additional_notes) {
      this.addSubtitle('Additional Notes / توضیحات اضافی');
      this.addText(registration.additional_notes);
    }

    // Footer
    this.checkPageBreak(30);
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    const currentDate = new Date().toLocaleDateString('fa-IR');
    const currentTime = new Date().toLocaleTimeString('fa-IR');
    this.doc.text(`Generated on / تولید شده در: ${currentDate} ${currentTime}`, this.margin, this.pageHeight - 10);
    
    if (registration.status) {
      this.doc.text(`Status / وضعیت: ${registration.status}`, this.margin + 100, this.pageHeight - 10);
    }

    return this.doc.output('arraybuffer');
  }
}