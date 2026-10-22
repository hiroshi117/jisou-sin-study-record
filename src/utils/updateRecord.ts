import { supabase } from "./supabaseClient";

export type UpdateRecordInput = {
  id: string;
  title: string;
  time: number;
};

export const updateRecord = async (input: UpdateRecordInput): Promise<void> => {
  const { error } = await supabase
    .from("study-record")
    .update({ title: input.title, time: input.time })
    .eq("id", input.id);

  if (error) {
    throw new Error(error.message);
  }
};
