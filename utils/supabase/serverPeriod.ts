import { createClient as createServerClient } from "./server";

export const period = {
  getCurrentPeriod: async () => {
    const supabase = await createServerClient();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;


    const { data, error } = await supabase
      .from("monthly_periods")
      .select("id, start_date, end_date")
      .eq("year", year)
      .eq("month", month)
      .maybeSingle();
      
    return { data, error };
  },
};
