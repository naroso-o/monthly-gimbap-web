import { createClient as createServerClient } from "./server";

// 서버 컴포넌트용 auth
export const auth = {
  getUser: async () => {
    const supabase = await createServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (!authData?.user) {
      return { data: null, error: authError };
    }

    // auth.users의 user_metadata에서 name 가져오기
    const user = {
      id: authData.user.id,
      email: authData.user.email || '',
      name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || '사용자',
      is_admin: authData.user.user_metadata?.is_admin || false,
      created_at: authData.user.created_at || '',
      updated_at: authData.user.updated_at || ''
    };

    return { data: user, error: null };
  },
};
