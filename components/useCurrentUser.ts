"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export function useCurrentUser() {
  const [user, setUser] = useState<null | { email: string, role?: string }>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        // Obtener el perfil del usuario
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()
        setUser({ email: data.user.email ?? "", role: profile?.role })
      } else {
        setUser(null)
      }
    }
    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return user
}