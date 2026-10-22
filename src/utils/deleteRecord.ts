import { supabase } from "./supabaseClient";

export const deleteRecord = async (id: string): Promise<void> => {
  const { error } = await supabase.from("study-record").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};
