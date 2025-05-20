import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/components/cart-context"

export function CartSheet() {
  const { cart, removeFromCart } = useCart()
  const isEmpty = cart.length === 0

  // Calcular subtotal
  const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-lg font-semibold">Carrito de compras</h2>
      </div>
      <Separator />
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center space-y-4">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <div className="text-center">
            <p className="text-lg font-medium">Tu carrito está vacío</p>
            <p className="text-sm text-muted-foreground">Añade algunos productos a tu carrito</p>
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 py-4">
            <ul className="space-y-4">
              {cart.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imagen || "/placeholder.svg"}
                      alt={item.nombre}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      {item.talle && <p className="text-xs text-gray-500">Talle: {item.talle}</p>}
                      <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold">{(item.precio * item.cantidad).toFixed(2)} €</p>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => removeFromCart(item.id, item.talle)}
                      title="Eliminar producto"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="text-sm font-medium">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Envío</span>
                <span className="text-sm font-medium">Calculado al finalizar</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Total</span>
                <span className="text-base font-medium">{subtotal.toFixed(2)} €</span>
              </div>
            </div>
            <Button className="w-full">Finalizar compra</Button>
          </div>
        </>
      )}
    </div>
  )
}
