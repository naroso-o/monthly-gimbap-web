export interface User {
    id: string;
    email: string;
    name: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface MonthlyPeriod {
    id: string;
    year: number;
    month: number;
    start_date: string;
    end_date: string;
    created_at: string;
  }
  
  export interface AttendanceRecord {
    id: string;
    user_id: string;
    period_id: string;
    attendance_date: string;
    start_time: string;
    end_time: string;
    is_wednesday: boolean;
    is_official_hours: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ChecklistAttendance {
    id: string;
    user_id: string;
    period_id: string;
    is_completed: boolean;
    wednesday_count: number;
    total_attendance_count: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface ChecklistBlogPost {
    id: string;
    user_id: string;
    period_id: string;
    is_completed: boolean;
    github_issue_url?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ChecklistComment {
    id: string;
    user_id: string;
    period_id: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface CommentCheck {
    id: string;
    checklist_comment_id: string;
    commenter_id: string;
    target_user_id: string;
    created_at: string;
  }
  
  export interface Penalty {
    id: string;
    user_id: string;
    period_id: string;
    blog_post_penalty: boolean;
    attendance_penalty: boolean;
    comment_penalty: boolean;
    total_penalty_amount: number;
    is_paid: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface MonthlyChecklistStatus {
    user_id: string;
    user_name: string;
    year: number;
    month: number;
    blog_completed: boolean;
    attendance_completed: boolean;
    comment_completed: boolean;
    wednesday_count: number;
    total_attendance_count: number;
    comment_count: number;
  }
  
  export interface UserMonthlyStats {
    user_id: string;
    user_name: string;
    year: number;
    month: number;
    total_hours: number;
    total_attendance_days: number;
    wednesday_count: number;
    official_hours_count: number;
  }
  
  export interface UserWeekdayStats {
    user_id: string;
    user_name: string;
    day_of_week: number;
    day_name: string;
    visit_count: number;
    avg_hours: number;
  }
  
  export interface UserHourlyStats {
    user_id: string;
    user_name: string;
    start_hour: number;
    frequency: number;
  }
  
  // Supabase Auth 관련 타입
  export interface AuthUser {
    id: string;
    email?: string;
    user_metadata?: {
      name?: string;
      [key: string]: string | boolean | number | undefined;
    };
  }
  
  export interface AuthSession {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user: AuthUser;
  }
  
  // API 응답 타입
  export interface ApiResponse<T> {
    data: T | null;
    error: Error | null;
  }
  
  // 폼 데이터 타입
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface PasswordChangeFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface AttendanceFormData {
    startTime: string;
    endTime: string;
    notes?: string;
  }
  
  // 컴포넌트 Props 타입
  export interface KimbapIconProps {
    size?: number;
    className?: string;
  }
  
  export interface TabItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }