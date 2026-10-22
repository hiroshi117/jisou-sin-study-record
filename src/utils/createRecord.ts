import { supabase } from "./supabaseClient";

export type CreateRecordInput = {
  title: string;
  time: number;
};

export const createRecord = async (input: CreateRecordInput): Promise<void> => {
  const { error } = await supabase.from("study-record").insert({
    title: input.title,
    time: input.time,
  });

  if (error) {
    throw new Error(error.message);
  }
};
