import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export function CartSheet() {
  const isEmpty = true

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
          <Button asChild>
            <Link href="/productos">Ver productos</Link>
          </Button>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 py-4">{/* Aquí irían los productos del carrito */}</ScrollArea>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="text-sm font-medium">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Envío</span>
                <span className="text-sm font-medium">Calculado al finalizar</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Total</span>
                <span className="text-base font-medium">$0.00</span>
              </div>
            </div>
            <Button className="w-full">Finalizar compra</Button>
          </div>
        </>
      )}
    </div>
  )
}
