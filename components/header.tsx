"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "@/components/cart-sheet"
import { useCart } from "@/components/cart-context"
import { useCurrentUser } from "./useCurrentUser"
import { supabase } from "@/lib/supabaseClient"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart() // <-- Añade esto

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const user = useCurrentUser()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            BasketStore
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu} aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/productos/camisetas" className="text-sm font-medium hover:text-primary">
              Camisetas
            </Link>
            <Link href="/productos/pantalones" className="text-sm font-medium hover:text-primary">
              Pantalones
            </Link>
            <Link href="/productos/medias" className="text-sm font-medium hover:text-primary">
              Medias
            </Link>
            <Link href="/productos/pelotas" className="text-sm font-medium hover:text-primary">
              Pelotas
            </Link>
            {/* Eliminar este bloque para quitar el "Iniciar sesión" de la izquierda del carrito */}
            {/* 
            {!user && (
              <Link href="/auth/login" className="text-sm font-medium hover:text-primary">
                Iniciar sesión
              </Link>
            )}
            */}
            {user?.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium hover:text-primary">
                Panel de administración
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((acc, item) => acc + item.cantidad, 0)}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <CartSheet />
              </SheetContent>
            </Sheet>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Hola, {user.email}</span>
                <button
                  className="text-sm font-medium text-red-500 hover:underline"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.reload()
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-sm font-medium hover:text-primary">
                  Iniciar sesión
                </Link>
                <Link href="/auth/register" className="text-sm font-medium hover:text-primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col space-y-4">
            <Link
              href="/productos/camisetas"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Camisetas
            </Link>
            <Link
              href="/productos/pantalones"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Pantalones
            </Link>
            <Link
              href="/productos/medias"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Medias
            </Link>
            <Link
              href="/productos/pelotas"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Pelotas
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
