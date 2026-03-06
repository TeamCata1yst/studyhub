export function createClient() {
  return {
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null })
    }),
    auth: {
      getUser: async () => ({ data: null }),
      signInWithPassword: async () => ({ data: null }),
      signOut: async () => ({})
    }
  }
}