export interface Candidate {
  user_id?: string;
  candidate_name?: string;
  mobile_number?: string;
  frontend_interview_date?: string;
  frontend_time_slot?: string;
  backend_interview_date?: string;
  backend_time_slot?: string;
  candidate_email?: string;
  candidate_resume_link?: string;
  meeting_link?: string;
  interview_duration?: string;
  interview_status?: string;
  company?: string,

  fr_self_introduction?: string;
  fr_self_introduction_rating?: number;
  fr_project_explanation?: string;
  fr_project_explanation_rating?: number;
  fr_communication?: string;
  fr_communication_rating?: number;
  frontend_feedback?: string;


  be_self_introduction?: string;
  be_self_introduction_rating?: number;
  be_project_explanation?: string;
  be_project_explanation_rating?: number;
  be_communication?: string;
  be_communication_rating?: number;
  backend_feedback?: string;
  
  html_css_theory?: string;
  html_coding_easy?: string;
  html_coding_medium?: string;
  html_coding_hard?: string;
  html_coding_overall_rating?: number;

  javascript_theory?: string;
  javascript_coding_easy?: string;
  javascript_coding_medium?: string;
  javascript_coding_hard?: string;
  javascript_overall_rating?: number;

  react_theory?: string;
  react_coding_easy?: string;
  react_coding_medium?: string;
  react_coding_hard?: string;
  react_overall_rating?: number;

  python_theory?: string;
  python_coding_easy?: string;
  python_coding_medium?: string;
  python_coding_hard?: string;
  python_overall_rating?: number;

  node_theory?: string;
  node_coding_easy?: string;
  node_coding_medium?: string;
  node_coding_hard?: string;
  node_overall_rating?: number;

  sql_theory?: string;
  sql_coding_easy?: string;
  sql_coding_medium?: string;
  sql_coding_hard?: string;
  sql_overall_rating?: number;

  placement_status?: string;

  strongest_skill?: string;

  fr_meeting_recording?: string;
  be_meeting_recording?: string;
}

export type CandidatePatchData = Partial<Candidate>;
