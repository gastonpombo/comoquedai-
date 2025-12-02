"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Loader2, Download, Trash2, Maximize2, X, AlertCircle, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import JSZip from "jszip"
import { saveAs } from "file-saver"

interface Generation {
  id: number
  input_image_url: string
  result_image_url: string
  created_at: string
  batch_id?: string
}

interface GroupedGeneration {
  id: string
  date: string
  items: Generation[]
}

export function GenerationsGallery() {
  const [groups, setGroups] = useState<GroupedGeneration[]>([])
  const [loading, setLoading] = useState(true)
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const [isZipping, setIsZipping] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchGenerations()
  }, [])

  const fetchGenerations = async () => {
    const { data } = await supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) {
        const groupedMap = new Map<string, GroupedGeneration>()
        data.forEach((gen: Generation) => {
            const key = gen.batch_id || `single-${gen.id}`
            if (!groupedMap.has(key)) {
                groupedMap.set(key, { id: key, date: gen.created_at, items: [] })
            }
            groupedMap.get(key)?.items.push(gen)
        })
        setGroups(Array.from(groupedMap.values()))
    }
    setLoading(false)
  }

  const handleDeleteGroup = async (groupId: string, items: Generation[]) => {
    const original = [...groups]
    setGroups(prev => prev.filter(g => g.id !== groupId))
    const idsToDelete = items.map(i => i.id)
    const { error } = await supabase.from('generations').delete().in('id', idsToDelete)
    if (error) {
        toast.error("Error al eliminar")
        setGroups(original)
    } else {
        toast.success("Eliminado")
    }
  }

  const handleDownloadImage = async (url: string, name: string) => {
    try {
        const res = await fetch(url)
        const blob = await res.blob()
        saveAs(blob, name)
    } catch {
        window.open(url, '_blank')
    }
  }

  const handleDownloadAll = async (group: GroupedGeneration) => {
    setIsZipping(group.id)
    try {
        const zip = new JSZip()
        const folder = zip.folder(`lote-${new Date(group.date).toISOString().split('T')[0]}`)
        let imageCounter = 1
        const promises = []
        
        for (const item of group.items) {
            let urls: string[] = []
            try {
                if (item.result_image_url.startsWith("[")) urls = JSON.parse(item.result_image_url)
                else urls = [item.result_image_url]
            } catch { urls = [item.result_image_url] }

            for (const url of urls) {
                if (!url) continue
                const p = fetch(url).then(res => res.blob()).then(blob => folder?.file(`imagen_${imageCounter++}.png`, blob))
                promises.push(p)
            }
        }
        await Promise.all(promises)
        const content = await zip.generateAsync({ type: "blob" })
        saveAs(content, `descarga-lote.zip`)
        toast.success("Pack descargado")
    } catch (e) {
        console.error(e)
        toast.error("Error al comprimir")
    } finally {
        setIsZipping(null)
    }
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  
  if (groups.length === 0) {
    return (
      <div className="text-center text-zinc-500 p-10 border-2 border-dashed border-zinc-800 rounded-xl">
        <p>Aún no has generado ninguna imagen.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => {
        const allImages: { url: string, input?: string }[] = []
        group.items.forEach(item => {
            let urls: string[] = []
            try {
                if (item.result_image_url && item.result_image_url.startsWith("[")) urls = JSON.parse(item.result_image_url)
                else urls = [item.result_image_url]
            } catch { urls = [item.result_image_url] }
            
            urls.forEach(u => { if(u) allImages.push({ url: u, input: item.input_image_url }) })
        })

        return (
            <div key={group.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-zinc-800/50 bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded bg-primary/10 text-primary">
                            <Layers className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">
                                {group.items.length > 1 ? `Lote de ${group.items.length} generaciones` : 'Generación única'}
                            </p>
                            <p className="text-xs text-zinc-500">{new Date(group.date).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-2 border-zinc-700 hover:bg-zinc-800" onClick={() => handleDownloadAll(group)} disabled={isZipping === group.id}>
                            {isZipping === group.id ? <Loader2 className="h-3 w-3 animate-spin"/> : <Download className="h-3 w-3" />}
                            Descargar Todo ({allImages.length})
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={() => handleDeleteGroup(group.id, group.items)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {allImages.map((img, idx) => (
                            <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden bg-black/20 border border-zinc-800">
                                <Image src={img.url} alt={`Gen ${idx}`} fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => setZoomImage(img.url)}><Maximize2 className="h-4 w-4" /></Button>
                                    <Button size="icon" className="h-8 w-8 rounded-full" onClick={() => handleDownloadImage(img.url, `img-${idx}.png`)}><Download className="h-4 w-4" /></Button>
                                </div>
                                {img.input && (
                                    <div className="absolute bottom-1 right-1 h-8 w-8 rounded border border-white/30 overflow-hidden bg-black/50">
                                        <Image src={img.input} alt="in" fill className="object-cover opacity-70" unoptimized />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
      })}

      <Dialog open={!!zoomImage} onOpenChange={() => setZoomImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none outline-none flex justify-center items-center">
            <DialogTitle className="sr-only">Zoom</DialogTitle>
            {zoomImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={zoomImage} alt="Zoom" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
            )}
            <button onClick={() => setZoomImage(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80">
                <X className="h-6 w-6"/>
            </button>
        </DialogContent>
      </Dialog>
    </div>
  )
}