"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const categoryNames = {
  camisetas: "Camisetas",
  pantalones: "Pantalones",
  calcetines: "Calcetines",
  pelotas: "Pelotas",
}

type Product = {
  id: string
  nombre: string
  precio: number
  imagen: string
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = React.use(params)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      let tipo = category
      if (tipo === "pantalones") tipo = "pantalon"
      if (tipo === "calcetines") tipo = "media"
      if (tipo === "camisetas") tipo = "camiseta"
      const { data, error } = await supabase
        .from("products")
        .select("id, nombre, precio, imagen")
        .eq("tipo", tipo)
      if (!error && data) {
        setProducts(data)
      } else {
        setProducts([])
      }
      setLoading(false)
    }
    fetchProducts()
  }, [category])

  const categoryName = categoryNames[category as keyof typeof categoryNames] || "Productos"

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
      {loading ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Cargando productos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No se encontraron productos en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/producto/${product.id}`}>
              <Card className="h-full overflow-hidden transition-transform hover:scale-[1.02]">
                <div className="relative h-64 w-full">
                  <Image src={product.imagen || "/placeholder.svg"} alt={product.nombre} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg">{product.nombre}</h2>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="font-bold">{product.precio?.toFixed(2)} €</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
