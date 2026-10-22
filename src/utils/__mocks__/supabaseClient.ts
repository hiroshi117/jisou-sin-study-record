export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ error: null }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null }),
    }),
  }),
};
