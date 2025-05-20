"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("") // Nuevo estado

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setConfirmationMessage("")
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setConfirmationMessage("¡Cuenta creada! Debes confirmar tu cuenta. Te hemos enviado un correo electrónico para la confirmación.")
      // Opcional: puedes limpiar los campos
      setEmail("")
      setPassword("")
      // No redirigir automáticamente al login
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">Registro</h1>
        <p className="mb-6 text-center text-gray-500 dark:text-gray-400">Crea tu cuenta en <span className="font-semibold text-primary">BasketStore</span></p>
        {confirmationMessage ? (
          <div className="mb-6 text-green-600 text-center font-semibold">{confirmationMessage}</div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        )}
        <div className="mt-6 text-center">
          <span className="text-gray-600 dark:text-gray-400">¿Ya tienes cuenta?</span>{" "}
          <a href="/auth/login" className="text-primary font-medium hover:underline">
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  )
}