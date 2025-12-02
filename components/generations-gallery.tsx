"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Loader2, Download, Trash2, Maximize2, X, Layers, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { motion, AnimatePresence } from "framer-motion"

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
            toast.success("Eliminado correctamente")
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

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Cargando tu galería...</p>
        </div>
    )

    if (groups.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-16 border border-dashed border-white/10 rounded-3xl bg-white/5"
            >
                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Layers className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Galería Vacía</h3>
                <p className="text-muted-foreground text-center max-w-md">
                    Aún no has generado ninguna imagen. Ve al Dashboard y comienza a crear contenido increíble.
                </p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-10">
            <AnimatePresence>
                {groups.map((group, index) => {
                    const allImages: { url: string, input?: string }[] = []
                    group.items.forEach(item => {
                        let urls: string[] = []
                        try {
                            if (item.result_image_url && item.result_image_url.startsWith("[")) urls = JSON.parse(item.result_image_url)
                            else urls = [item.result_image_url]
                        } catch { urls = [item.result_image_url] }

                        urls.forEach(u => { if (u) allImages.push({ url: u, input: item.input_image_url }) })
                    })

                    return (
                        <motion.div
                            key={group.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.1 }}
                            className="group/card bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10">
                                        <Layers className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                            {group.items.length > 1 ? `Lote de ${group.items.length} imágenes` : 'Generación única'}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(group.date).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 gap-2 border-white/10 bg-black/20 hover:bg-white/10 hover:text-white transition-colors"
                                        onClick={() => handleDownloadAll(group)}
                                        disabled={isZipping === group.id}
                                    >
                                        {isZipping === group.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                        <span className="hidden sm:inline">Descargar Pack</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                        onClick={() => handleDeleteGroup(group.id, group.items)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {allImages.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 shadow-lg"
                                        >
                                            <Image
                                                src={img.url}
                                                alt={`Gen ${idx}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                unoptimized
                                            />

                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-10 w-10 rounded-full bg-white text-black hover:bg-white/90 hover:scale-110 transition-all"
                                                    onClick={() => setZoomImage(img.url)}
                                                >
                                                    <Maximize2 className="h-5 w-5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    className="h-10 w-10 rounded-full bg-primary text-white hover:bg-primary/90 hover:scale-110 transition-all shadow-lg shadow-primary/25"
                                                    onClick={() => handleDownloadImage(img.url, `img-${idx}.png`)}
                                                >
                                                    <Download className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            {img.input && (
                                                <div className="absolute bottom-2 right-2 h-10 w-10 rounded-lg border border-white/20 overflow-hidden bg-black/50 shadow-lg group-hover:opacity-0 transition-opacity">
                                                    <Image src={img.input} alt="in" fill className="object-cover opacity-80" unoptimized />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>

            <Dialog open={!!zoomImage} onOpenChange={() => setZoomImage(null)}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none outline-none flex justify-center items-center">
                    <DialogTitle className="sr-only">Zoom</DialogTitle>
                    {zoomImage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={zoomImage} alt="Zoom" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10 bg-black/50 backdrop-blur-xl" />
                            <button
                                onClick={() => setZoomImage(null)}
                                className="absolute -top-4 -right-4 bg-white text-black p-2 rounded-full hover:bg-white/90 shadow-lg transition-transform hover:scale-110"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </motion.div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}