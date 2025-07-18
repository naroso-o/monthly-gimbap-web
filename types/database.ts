// types/database.ts
export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string
            email: string
            name: string
            is_admin: boolean
            created_at: string
            updated_at: string
          }
          Insert: {
            id: string
            email: string
            name: string
            is_admin?: boolean
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            email?: string
            name?: string
            is_admin?: boolean
            created_at?: string
            updated_at?: string
          }
        }
        monthly_periods: {
          Row: {
            id: string
            year: number
            month: number
            start_date: string
            end_date: string
            created_at: string
          }
          Insert: {
            id?: string
            year: number
            month: number
            start_date: string
            end_date: string
            created_at?: string
          }
          Update: {
            id?: string
            year?: number
            month?: number
            start_date?: string
            end_date?: string
            created_at?: string
          }
        }
        attendance_records: {
          Row: {
            id: string
            user_id: string
            period_id: string
            attendance_date: string
            start_time: string
            end_time: string
            is_wednesday: boolean
            is_official_hours: boolean
            notes: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            period_id: string
            attendance_date: string
            start_time: string
            end_time: string
            is_wednesday?: boolean
            is_official_hours?: boolean
            notes?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            period_id?: string
            attendance_date?: string
            start_time?: string
            end_time?: string
            is_wednesday?: boolean
            is_official_hours?: boolean
            notes?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        checklist_blog_posts: {
          Row: {
            id: string
            user_id: string
            period_id: string
            is_completed: boolean
            github_issue_url: string | null
            completed_at: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            period_id: string
            is_completed?: boolean
            github_issue_url?: string | null
            completed_at?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            period_id?: string
            is_completed?: boolean
            github_issue_url?: string | null
            completed_at?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        checklist_attendance: {
          Row: {
            id: string
            user_id: string
            period_id: string
            is_completed: boolean
            wednesday_count: number
            total_attendance_count: number
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            period_id: string
            is_completed?: boolean
            wednesday_count?: number
            total_attendance_count?: number
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            period_id?: string
            is_completed?: boolean
            wednesday_count?: number
            total_attendance_count?: number
            created_at?: string
            updated_at?: string
          }
        }
        checklist_comments: {
          Row: {
            id: string
            user_id: string
            period_id: string
            is_completed: boolean
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            period_id: string
            is_completed?: boolean
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            period_id?: string
            is_completed?: boolean
            created_at?: string
            updated_at?: string
          }
        }
        comment_checks: {
          Row: {
            id: string
            checklist_comment_id: string
            commenter_id: string
            target_user_id: string
            created_at: string
          }
          Insert: {
            id?: string
            checklist_comment_id: string
            commenter_id: string
            target_user_id: string
            created_at?: string
          }
          Update: {
            id?: string
            checklist_comment_id?: string
            commenter_id?: string
            target_user_id?: string
            created_at?: string
          }
        }
      }
      Views: {
        checklist_statuses: {
          Row: {
            user_id: string
            user_name: string
            period_id: string
            year: number
            month: number
            blog_completed: boolean
            attendance_completed: boolean
            comments_completed: boolean
            wednesday_count: number
            total_attendance: number
            comment_count: number
          }
        }
      }
    }
  }