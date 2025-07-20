import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./server";

export const period = {
  getCurrentPeriod: async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const supabase = await createClient();
    const { data, error } = await (supabase as SupabaseClient)
      .from("monthly_periods")
      .select("id, start_date, end_date")
      .eq("year", year)
      .eq("month", month)
      .maybeSingle();

    return { data, error };
  },
};
