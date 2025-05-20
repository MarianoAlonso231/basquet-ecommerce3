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
  const [stock, setStock] = useState("") // Nuevo estado para el stock

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
    setStock(producto.stock?.toString() || "") // Cargar stock al editar
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
      precio: parseFloat(precio),
      stock: parseInt(stock) // Actualizar stock
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
      setStock("")
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
        precio: parseFloat(precio),
        stock: parseInt(stock) // Guardar stock
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
      setStock("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-8 bg-gray-900">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Panel de administración</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-300">Agregar nuevo producto</h2>
          <label className="block text-gray-200 mb-1" htmlFor="tipo">Tipo de producto</label>
          <select
            id="tipo"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="w-full border p-2 rounded bg-gray-700 text-gray-100"
            required
          >
            <option value="camiseta">Camiseta</option>
            <option value="pantalon">Pantalón</option>
            <option value="media">Media</option>
            <option value="pelota">Pelota</option>
          </select>
          <label className="block text-gray-200 mb-1" htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full border p-2 rounded bg-gray-700 text-gray-100"
            required
          />
          <label className="block text-gray-200 mb-1" htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            placeholder="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full border p-2 rounded bg-gray-700 text-gray-100"
            required
          />
          <label className="block text-gray-200 mb-1" htmlFor="imagen">Imagen</label>
          <input
            id="imagen"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="w-full border p-2 rounded bg-gray-700 text-gray-100"
            required
          />
          {(tipo === "camiseta" || tipo === "pantalon" || tipo === "media") && (
            <>
              <label className="block text-gray-200 mb-1" htmlFor="talle">Talle</label>
              <input
                id="talle"
                type="text"
                placeholder="Talle"
                value={talle}
                onChange={e => setTalle(e.target.value)}
                className="w-full border p-2 rounded bg-gray-700 text-gray-100"
              />
            </>
          )}
          {(tipo === "camiseta" || tipo === "pantalon") && (
            <>
              <label className="block text-gray-200 mb-1" htmlFor="dorsal">Dorsal</label>
              <input
                id="dorsal"
                type="text"
                placeholder="Dorsal"
                value={dorsal}
                onChange={e => setDorsal(e.target.value)}
                className="w-full border p-2 rounded bg-gray-700 text-gray-100"
              />
            </>
          )}
          {tipo === "pelota" && (
            <>
              <label className="block text-gray-200 mb-1" htmlFor="tamano">Tamaño</label>
              <input
                id="tamano"
                type="text"
                placeholder="Tamaño"
                value={tamano}
                onChange={e => setTamano(e.target.value)}
                className="w-full border p-2 rounded bg-gray-700 text-gray-100"
              />
            </>
          )}
          <div className="flex gap-4">
            <div className="w-full">
              <label className="block text-gray-200 mb-1" htmlFor="precio">Precio</label>
              <input
                id="precio"
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                className="w-full border p-2 rounded bg-gray-700 text-gray-100"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-200 mb-1" htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full border p-2 rounded bg-gray-700 text-gray-100"
                required
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 transition text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar producto"}
          </button>
          {mensaje && <p className="text-center text-green-400">{mensaje}</p>}
        </form>
      </div>
      {/* Lista de productos */}
      <div className="mt-12 w-full max-w-2xl bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-xl font-bold mb-4 text-blue-300">Productos cargados</h2>
        {productos.length === 0 ? (
          <p className="text-center text-gray-400">No hay productos cargados.</p>
        ) : (
          <ul className="space-y-4">
            {productos.map(producto => (
              <li key={producto.id} className="border border-gray-700 rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-900">
                <div>
                  <strong className="text-lg text-gray-100">{producto.nombre}</strong> - <span className="capitalize text-gray-300">{producto.tipo}</span> - <span className="font-semibold text-blue-400">{producto.precio} €</span> - <span className="text-blue-300">Stock: {producto.stock}</span>
                  <div className="text-sm text-gray-400">{producto.descripcion}</div>
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded"
                    onClick={() => handleEditar(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <form onSubmit={handleGuardarEdicion} className="space-y-4 max-w-md w-full border border-gray-700 p-6 rounded bg-gray-900 shadow-lg relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
              onClick={() => setEditando(null)}
              title="Cerrar"
            >✕</button>
            <h3 className="font-bold text-xl mb-2 text-blue-400">Editar producto</h3>
            <label className="block text-gray-200 mb-1" htmlFor="nombre-edit">Nombre</label>
            <input
              id="nombre-edit"
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full border p-2 rounded bg-gray-700 text-gray-100"
              required
            />
            <label className="block text-gray-200 mb-1" htmlFor="descripcion-edit">Descripción</label>
            <textarea
              id="descripcion-edit"
              placeholder="Descripción"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full border p-2 rounded bg-gray-700 text-gray-100"
              required
            />
            {(tipo === "camiseta" || tipo === "pantalon" || tipo === "media") && (
              <>
                <label className="block text-gray-200 mb-1" htmlFor="talle-edit">Talle</label>
                <input
                  id="talle-edit"
                  type="text"
                  placeholder="Talle"
                  value={talle}
                  onChange={e => setTalle(e.target.value)}
                  className="w-full border p-2 rounded bg-gray-700 text-gray-100"
                />
              </>
            )}
            {(tipo === "camiseta" || tipo === "pantalon") && (
              <>
                <label className="block text-gray-200 mb-1" htmlFor="dorsal-edit">Dorsal</label>
                <input
                  id="dorsal-edit"
                  type="text"
                  placeholder="Dorsal"
                  value={dorsal}
                  onChange={e => setDorsal(e.target.value)}
                  className="w-full border p-2 rounded bg-gray-700 text-gray-100"
                />
              </>
            )}
            {tipo === "pelota" && (
              <>
                <label className="block text-gray-200 mb-1" htmlFor="tamano-edit">Tamaño</label>
                <input
                  id="tamano-edit"
                  type="text"
                  placeholder="Tamaño"
                  value={tamano}
                  onChange={e => setTamano(e.target.value)}
                  className="w-full border p-2 rounded bg-gray-700 text-gray-100"
                />
              </>
            )}
            <div className="flex gap-4">
              <div className="w-full">
                <label className="block text-gray-200 mb-1" htmlFor="precio-edit">Precio</label>
                <input
                  id="precio-edit"
                  type="number"
                  placeholder="Precio"
                  value={precio}
                  onChange={e => setPrecio(e.target.value)}
                  className="w-full border p-2 rounded bg-gray-700 text-gray-100"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="w-full">
                <label className="block text-gray-200 mb-1" htmlFor="stock-edit">Stock</label>
                <input
                  id="stock-edit"
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                  className="w-full border p-2 rounded bg-gray-700 text-gray-100"
                  required
                  min="0"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 transition text-white py-2 rounded font-semibold" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button type="button" className="w-full bg-gray-600 hover:bg-gray-700 transition text-white py-2 rounded" onClick={() => setEditando(null)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}