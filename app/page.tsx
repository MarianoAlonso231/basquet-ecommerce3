import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const categories = [
    {
      id: "camisetas",
      name: "Camisetas",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "pantalones",
      name: "Pantalones",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "calcetines",
      name: "Calcetines",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "pelotas",
      name: "Pelotas",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Basketball Store"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Equípate para la cancha</h1>
            <p className="text-xl mb-6 text-center max-w-2xl">Todo lo que necesitas para brillar en el juego</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Categorías</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/productos/${category.id}`}>
              <Card className="overflow-hidden h-full transition-transform hover:scale-[1.02]">
                <div className="relative h-48 w-full">
                  <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold text-center">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
