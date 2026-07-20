import { Record } from "../domain/record";
import { supabase } from "./supabaseClient";

export const fetchRecords = async (): Promise<Record[]> => {
  const { data, error } = await supabase
    .from("study-record")
    .select("id,title,time");
  if (error) {
    throw new Error(" error");
  }
  return (data ?? []).map((row) => new Record(row.id, row.title, row.time));
};
