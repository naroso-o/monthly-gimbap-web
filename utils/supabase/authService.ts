import { createClient } from "./client";

export const auth = {
    signIn: async (email: string, password: string) => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    },
    signOut: async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        return { error }
    },
}