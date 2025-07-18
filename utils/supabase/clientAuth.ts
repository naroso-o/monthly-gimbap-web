import { createClient } from "./client";

// 클라이언트 전용 auth 함수들
export const clientAuth = {
  signUp: async (email: string, password: string, name: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          is_admin: false
        }
      }
    });
    return { data, error };
  },
  signIn: async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },
  signOut: async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  getUser: async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },
  updateUserMetadata: async (updates: { name?: string; is_admin?: boolean }) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    return { data, error };
  },
}; 