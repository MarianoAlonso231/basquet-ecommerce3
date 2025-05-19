"use client"

import Image from "next/image"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Product = {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  talle?: string
  dorsal?: string
  tamano?: string
  tipo: string
  precio?: number
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTalle, setSelectedTalle] = useState<string>("")
  const [cantidad, setCantidad] = useState<number>(1)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()
      if (!error && data) {
        setProduct(data)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) return <p>Cargando producto...</p>
  if (!product) return notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.imagen || "/placeholder.svg"}
            alt={product.nombre}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{product.nombre}</CardTitle>
            <CardDescription className="text-xl font-bold">{product.precio?.toFixed(2)} €</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Descripción</h3>
              <p className="text-muted-foreground">{product.descripcion}</p>
            </div>
            {/* Mostrar talles si existen */}
            {product.talle && (
              <div>
                <h3 className="font-medium mb-2">Talle</h3>
                <select
                  className="border rounded p-2 w-full"
                  value={selectedTalle}
                  onChange={e => setSelectedTalle(e.target.value)}
                  required
                >
                  <option value="">Selecciona un talle</option>
                  {product.talle.split(",").map((t: string) => (
                    <option key={t.trim()} value={t.trim()}>{t.trim()}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Mostrar dorsal si existe */}
            {product.dorsal && (
              <div>
                <h3 className="font-medium mb-2">Dorsal</h3>
                <p>{product.dorsal}</p>
              </div>
            )}
            {/* Mostrar tamaño si existe */}
            {product.tamano && (
              <div>
                <h3 className="font-medium mb-2">Tamaño</h3>
                <p>{product.tamano}</p>
              </div>
            )}
            {/* Selección de cantidad */}
            <div>
              <h3 className="font-medium mb-2">Cantidad</h3>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={e => setCantidad(Number(e.target.value))}
                className="border rounded p-2 w-24"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full"
              // Aquí puedes añadir la lógica para añadir al carrito, usando selectedTalle y cantidad
            >
              Añadir al carrito
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
