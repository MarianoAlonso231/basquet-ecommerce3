"use client"

import { useCurrentUser } from "@/components/useCurrentUser"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminPage() {
  const user = useCurrentUser()
  const router = useRouter()

  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [imagen, setImagen] = useState("")
  const [talle, setTalle] = useState("")
  const [dorsal, setDorsal] = useState("")
  const [tamano, setTamano] = useState("")
  const [tipo, setTipo] = useState("camiseta")
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [precio, setPrecio] = useState("")
  const [productos, setProductos] = useState<any[]>([])
  const [editando, setEditando] = useState<any | null>(null)

  // Obtener productos al cargar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase.from("products").select("*")
      if (!error && data) setProductos(data)
    }
    fetchProductos()
  }, [mensaje])

  // Borrar producto
  const handleBorrar = async (id: string) => {
    if (window.confirm("¿Seguro que quieres borrar este producto?")) {
      await supabase.from("products").delete().eq("id", id)
      setMensaje("Producto borrado correctamente")
      setProductos(productos.filter(p => p.id !== id))
    }
  }

  // Cargar producto en modo edición
  const handleEditar = (producto: any) => {
    setEditando(producto)
    setNombre(producto.nombre)
    setDescripcion(producto.descripcion)
    setTalle(producto.talle || "")
    setDorsal(producto.dorsal || "")
    setTamano(producto.tamano || "")
    setTipo(producto.tipo)
    setPrecio(producto.precio?.toString() || "")
    setImagen(producto.imagen)
  }

  // Guardar cambios de edición
  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje("")
    const { error } = await supabase.from("products").update({
      nombre,
      descripcion,
      talle: talle || null,
      dorsal: dorsal || null,
      tamano: tamano || null,
      tipo,
      precio: parseFloat(precio)
    }).eq("id", editando.id)
    setLoading(false)
    if (error) {
      setMensaje("Error al actualizar el producto")
    } else {
      setMensaje("Producto actualizado correctamente")
      setEditando(null)
      setNombre("")
      setDescripcion("")
      setTalle("")
      setDorsal("")
      setTamano("")
      setTipo("camiseta")
      setPrecio("")
    }
  }

  // Lógica de control de acceso
  if (!user) return <p>Cargando...</p>
  if (user.role !== "admin") {
    router.push("/")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje("")

    let imageUrl = ""

    // Si hay un archivo seleccionado, subirlo a Supabase Storage
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
      const file = fileInputRef.current.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file)

      if (uploadError) {
        setMensaje("Error al subir la imagen")
        setLoading(false)
        return
      }

      // Obtener la URL pública
      const { data: publicUrlData } = supabase
        .storage
        .from("products")
        .getPublicUrl(fileName)
      imageUrl = publicUrlData.publicUrl
    } else {
      setMensaje("Por favor selecciona una imagen")
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from("products")
      .insert([{
        nombre,
        descripcion,
        imagen: imageUrl,
        talle: talle || null,
        dorsal: dorsal || null,
        tamano: tamano || null,
        tipo,
        precio: parseFloat(precio)
      }])
    setLoading(false)
    if (error) {
      setMensaje("Error al guardar el producto")
    } else {
      setMensaje("Producto guardado correctamente")
      setNombre("")
      setDescripcion("")
      setTalle("")
      setDorsal("")
      setTamano("")
      setTipo("camiseta")
      setPrecio("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <h1 className="text-2xl font-bold mb-4">Panel de administración</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
        <select
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="camiseta">Camiseta</option>
          <option value="pantalon">Pantalón</option>
          <option value="media">Media</option>
          <option value="pelota">Pelota</option>
        </select>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        {/* Input para subir archivo de imagen */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="w-full border p-2 rounded"
          required
        />
        {/* Solo mostrar talle para camiseta, pantalon y media */}
        {(tipo === "camiseta" || tipo === "pantalon" || tipo === "media") && (
          <input
            type="text"
            placeholder="Talle"
            value={talle}
            onChange={e => setTalle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        )}
        {/* Solo mostrar dorsal para camiseta y pantalon */}
        {(tipo === "camiseta" || tipo === "pantalon") && (
          <input
            type="text"
            placeholder="Dorsal"
            value={dorsal}
            onChange={e => setDorsal(e.target.value)}
            className="w-full border p-2 rounded"
          />
        )}
        {/* Solo mostrar tamaño para pelotas */}
        {tipo === "pelota" && (
          <input
            type="text"
            placeholder="Tamaño"
            value={tamano}
            onChange={e => setTamano(e.target.value)}
            className="w-full border p-2 rounded"
          />
        )}
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          className="w-full border p-2 rounded"
          required
          min="0"
          step="0.01"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar producto"}
        </button>
        {mensaje && <p className="text-center">{mensaje}</p>}
      </form>
      {/* Lista de productos */}
      <div className="mt-12 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Productos cargados</h2>
        {productos.length === 0 ? (
          <p>No hay productos cargados.</p>
        ) : (
          <ul className="space-y-4">
            {productos.map(producto => (
              <li key={producto.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <strong>{producto.nombre}</strong> - {producto.tipo} - {producto.precio} €
                  <div className="text-sm text-muted-foreground">{producto.descripcion}</div>
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEditar(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleBorrar(producto.id)}
                  >
                    Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Formulario de edición (opcional, solo si editando !== null) */}
      {editando && (
        <form onSubmit={handleGuardarEdicion} className="space-y-4 max-w-md w-full mt-8 border p-4 rounded bg-gray-50">
          <h3 className="font-bold">Editar producto</h3>
          {/* ...inputs para nombre, descripción, talle, dorsal, tamaño, tipo, precio... */}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <button type="button" className="w-full bg-gray-400 text-white py-2 rounded" onClick={() => setEditando(null)}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  )
}