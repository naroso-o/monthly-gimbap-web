
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


// API 응답 타입
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}


export interface AttendanceFormData {
  startTime: string;
  endTime: string;
  notes?: string;
}


export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
