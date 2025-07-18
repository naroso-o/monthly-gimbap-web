// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type {
  User,
  MonthlyPeriod,
  AttendanceRecord,
  ChecklistBlogPost,
  ChecklistAttendance,
  ChecklistComment,
  CommentCheck,
  MonthlyChecklistStatus,
  UserMonthlyStats,
  UserWeekdayStats,
  UserHourlyStats,
  ApiResponse,
  AuthSession,
} from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 인증 헬퍼 함수들
export const auth = {
  // 로그인
  signIn: async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // 에러가 있어도 정상적인 응답으로 처리
      return result;
    } catch (error) {
      // 네트워크 에러나 예상치 못한 에러 처리
      console.error('Unexpected auth error:', error);
      return {
        data: { user: null, session: null },
        error: { message: '로그인 중 오류가 발생했습니다.' }
      };
    }
  },

  // 로그아웃
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // 비밀번호 변경
  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({
      password
    });
  },

  // 현재 세션 가져오기
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  // 현재 사용자 정보 가져오기
  getUser: async () => {
    return await supabase.auth.getUser();
  },

  // 인증 상태 변경 리스너
  onAuthStateChange: (callback: (event: string, session: AuthSession | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// 데이터베이스 헬퍼 함수들
export const db = {
  // 사용자 정보 가져오기
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
  },

  // 사용자 정보 업데이트
  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    return await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();
  },

  // 월별 기간 가져오기
  getMonthlyPeriods: async (): Promise<ApiResponse<MonthlyPeriod[]>> => {
    return await supabase
      .from('monthly_periods')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false });
  },

  // 현재 월 기간 가져오기
  getCurrentPeriod: async (): Promise<ApiResponse<MonthlyPeriod>> => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return await supabase
      .from('monthly_periods')
      .select('*')
      .eq('year', year)
      .eq('month', month)
      .single();
  },

  // 출석 기록 추가
  addAttendanceRecord: async (data: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at' | 'is_wednesday' | 'is_official_hours'>): Promise<ApiResponse<AttendanceRecord>> => {
    return await supabase
      .from('attendance_records')
      .insert(data)
      .select()
      .single();
  },

  // 출석 기록 조회
  getAttendanceRecords: async (userId: string, periodId: string): Promise<ApiResponse<AttendanceRecord[]>> => {
    return await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', userId)
      .eq('period_id', periodId)
      .order('attendance_date', { ascending: false });
  },

  // 블로그 글 체크리스트 업데이트
  updateBlogChecklist: async (
    userId: string, 
    periodId: string, 
    data: Partial<ChecklistBlogPost>
  ): Promise<ApiResponse<ChecklistBlogPost>> => {
    return await supabase
      .from('checklist_blog_posts')
      .upsert({
        user_id: userId,
        period_id: periodId,
        ...data
      })
      .select()
      .single();
  },

  // 출석 체크리스트 조회
  getAttendanceChecklist: async (userId: string, periodId: string): Promise<ApiResponse<ChecklistAttendance>> => {
    return await supabase
      .from('checklist_attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('period_id', periodId)
      .single();
  },

  // 댓글 체크리스트 조회
  getCommentChecklist: async (userId: string, periodId: string): Promise<ApiResponse<ChecklistComment>> => {
    return await supabase
      .from('checklist_comments')
      .select('*')
      .eq('user_id', userId)
      .eq('period_id', periodId)
      .single();
  },

  // 댓글 체크 추가
  addCommentCheck: async (
    checklistCommentId: string, 
    commenterId: string, 
    targetUserId: string
  ): Promise<ApiResponse<CommentCheck>> => {
    return await supabase
      .from('comment_checks')
      .insert({
        checklist_comment_id: checklistCommentId,
        commenter_id: commenterId,
        target_user_id: targetUserId
      })
      .select()
      .single();
  },

  // 댓글 체크 삭제
  removeCommentCheck: async (
    checklistCommentId: string, 
    commenterId: string, 
    targetUserId: string
  ): Promise<ApiResponse<null>> => {
    return await supabase
      .from('comment_checks')
      .delete()
      .eq('checklist_comment_id', checklistCommentId)
      .eq('commenter_id', commenterId)
      .eq('target_user_id', targetUserId);
  },

  // 특정 사용자의 댓글 체크 조회
  getCommentChecks: async (commenterId: string, periodId: string): Promise<ApiResponse<CommentCheck[]>> => {
    return await supabase
      .from('comment_checks')
      .select(`
        *,
        checklist_comments!inner(period_id)
      `)
      .eq('commenter_id', commenterId)
      .eq('checklist_comments.period_id', periodId);
  },

  // 월별 체크리스트 현황 조회
  getMonthlyChecklistStatus: async (userId: string, year: number, month: number): Promise<ApiResponse<MonthlyChecklistStatus>> => {
    return await supabase
      .from('monthly_checklist_status')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .eq('month', month)
      .single();
  },

  // 사용자별 월별 통계 조회
  getUserMonthlyStats: async (userId: string, year: number, month: number): Promise<ApiResponse<UserMonthlyStats>> => {
    return await supabase
      .from('user_monthly_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .eq('month', month)
      .single();
  },

  // 사용자별 요일별 통계 조회
  getUserWeekdayStats: async (userId: string): Promise<ApiResponse<UserWeekdayStats[]>> => {
    return await supabase
      .from('user_weekday_stats')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week');
  },

  // 사용자별 시간대별 통계 조회
  getUserHourlyStats: async (userId: string): Promise<ApiResponse<UserHourlyStats[]>> => {
    return await supabase
      .from('user_hourly_stats')
      .select('*')
      .eq('user_id', userId)
      .order('start_hour');
  },

  // 모든 사용자 목록 조회 (관리자용)
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    return await supabase
      .from('users')
      .select('*')
      .eq('is_admin', false)
      .order('name');
  },

  // 사용자 체크리스트 초기화
  initializeUserChecklists: async (userId: string, periodId: string): Promise<ApiResponse<null>> => {
    return await supabase
      .rpc('initialize_user_checklists', {
        user_id_param: userId,
        period_id_param: periodId
      });
  }
};

// 유틸리티 함수들
export const utils = {
  // 시간 포맷팅 (HH:MM)
  formatTime: (time: string): string => {
    return time.substring(0, 5);
  },

  // 날짜 포맷팅 (YYYY-MM-DD)
  formatDate: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  // 요일 이름 가져오기
  getDayName: (dayOfWeek: number): string => {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return days[dayOfWeek] || '';
  },

  // 공식 시간(11PM-12AM) 체크
  isOfficialHours: (startTime: string, endTime: string): boolean => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const officialStart = new Date('2000-01-01T23:00:00');
    const officialEnd = new Date('2000-01-02T00:59:59');

    return (start <= officialEnd && end >= officialStart);
  },

  // 수요일 체크
  isWednesday: (date: string): boolean => {
    const dateObj = new Date(date);
    return dateObj.getDay() === 3;
  }
};