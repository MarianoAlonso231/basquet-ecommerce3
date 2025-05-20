"use client"

import React, { createContext, useContext, useState } from "react"

type CartItem = {
  id: string
  nombre: string
  precio: number
  imagen: string
  cantidad: number
  talle?: string
  stock: number // <-- Ahora obligatorio
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, talle?: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // Si ya existe el producto con el mismo talle, suma la cantidad
      const existing = prev.find(
        i => i.id === item.id && i.talle === item.talle
      )
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.talle === item.talle
            ? { ...i, cantidad: i.cantidad + item.cantidad }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string, talle?: string) => {
    setCart(prev =>
      prev.filter(i => !(i.id === id && i.talle === talle))
    )
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider")
  return context
}