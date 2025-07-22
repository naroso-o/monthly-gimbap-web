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
