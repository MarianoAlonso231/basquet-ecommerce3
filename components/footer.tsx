import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">BasketStore</h3>
            <p className="text-sm text-muted-foreground">Tu tienda especializada en productos de baloncesto.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/productos/camisetas" className="text-sm text-muted-foreground hover:text-foreground">
                  Camisetas
                </Link>
              </li>
              <li>
                <Link href="/productos/pantalones" className="text-sm text-muted-foreground hover:text-foreground">
                  Pantalones
                </Link>
              </li>
              <li>
                <Link href="/productos/calcetines" className="text-sm text-muted-foreground hover:text-foreground">
                  Calcetines
                </Link>
              </li>
              <li>
                <Link href="/productos/pelotas" className="text-sm text-muted-foreground hover:text-foreground">
                  Pelotas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Información</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre-nosotros" className="text-sm text-muted-foreground hover:text-foreground">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground hover:text-foreground">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-sm text-muted-foreground hover:text-foreground">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-sm text-muted-foreground hover:text-foreground">
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="text-sm text-muted-foreground hover:text-foreground">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-foreground">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BasketStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
