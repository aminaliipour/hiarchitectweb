export interface FormData {
  // Personal Information
  full_name: string;
  birth_date: string;
  national_id: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  
  // Behavioral Questions
  digital_interests: string[];
  first_salary_plan: string;
  shopping_preference: string;
  attractive_traits: string[];
  mountain_path_choice: string;
  free_time_activity: string;
  work_mistake_reaction: string;
  soup_preference: string;
  workspace_cleanliness: string;
  previous_work_environment: string;
  colleague_problem_help: string;
  colleague_oversight: string;
  overtime_request_reaction: string;
  rejection_reaction: string;
  
  // Educational Information
  education_level: string;
  field_of_study: string;
  university: string;
  graduation_year: string;
  gpa: string;
  
  // Work Experience
  work_experience_years: string;
  current_position: string;
  work_history: Array<{
    job_title: string;
    company: string;
    start_date: string;
    end_date: string;
    reason_for_leaving: string;
  }>;
  
  // Extended Questions
  why_join_company: string;
  criticism_opinion: string;
  teamwork_budget: string;
  improvement_suggestion: string;
  group_criticism: string;
  group_management: string;
  employment_reason: string;
  goals_and_plans: string;
  customer_service: string;
  salary_choice: string;
  company_research: string;
  skill_opinion: string;
  career_goal: string;
  
  // Personal Reflection
  worst_work_day: string;
  best_work_day: string;
  biggest_work_challenge: string;
  what_motivates: string;
  personal_strengths: string;
  
  // Skills & Experience
  skills: string[];
  software_proficiency: string[];
  languages: string[];
  has_portfolio: boolean;
  portfolio_url: string;
  project_types: string[];
  
  // Career Preferences
  preferred_position: string;
  salary_expectation: string;
  availability_date: string;
  work_schedule_preference: string;
  
  // Additional Information
  cover_letter: string;
  additional_notes: string;
}