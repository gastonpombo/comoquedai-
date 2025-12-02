"use client"

import { useState, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Upload, X, FileImage, CheckCircle, XCircle, Save, FolderOpen, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface WorkflowInputConfig {
  name: string
  type: "text" | "number" | "image" | "select" | "textarea"
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  defaultValue?: any
  multiple?: boolean
}

interface RunWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflow: any
  onGenerate: (inputs: any) => Promise<boolean>
}

// Tipo para el Preset
interface Preset {
  id: number
  name: string
  form_values: Record<string, any>
}

export function RunWorkflowDialog({ open, onOpenChange, workflow, onGenerate }: RunWorkflowDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  // Estado del Formulario
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [imageFiles, setImageFiles] = useState<Record<string, File[]>>({})
  const [previews, setPreviews] = useState<Record<string, string[]>>({})
  
  const [shouldRename, setShouldRename] = useState(false)
  
  // Progreso
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // ESTADO PARA PRESETS
  const [presets, setPresets] = useState<Preset[]>([])
  const [loadingPresets, setLoadingPresets] = useState(false)
  const [presetName, setPresetName] = useState("")
  const [showSavePreset, setShowSavePreset] = useState(false)

  const inputConfigs: WorkflowInputConfig[] = workflow.inputs_config?.inputs || []
  const batchInputConfig = inputConfigs.find(c => c.type === 'image' && c.multiple === true)
  const batchInputName = batchInputConfig?.name

  const supabase = createClient()

  // Reset y Carga Inicial
  useEffect(() => {
    if (open) {
      const initials: Record<string, any> = {}
      inputConfigs.forEach(conf => {
        if (conf.defaultValue !== undefined) initials[conf.name] = conf.defaultValue
        else initials[conf.name] = "" 
      })
      setFormValues(initials)
      setImageFiles({})
      setPreviews({})
      setCompletedCount(0)
      setErrorCount(0)
      setTotalItems(0)
      setShouldRename(false)
      setShowSavePreset(false)
      setPresetName("")
      
      // Cargar Presets
      fetchPresets()
    }
  }, [open, inputConfigs])

  useEffect(() => {
    return () => {
      Object.values(previews).flat().forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  // --- LÓGICA DE PRESETS ---
  const fetchPresets = async () => {
    setLoadingPresets(true)
    const { data } = await supabase.from('brand_presets').select('*').order('created_at', { ascending: false })
    if (data) setPresets(data)
    setLoadingPresets(false)
  }

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
        toast.error("Ponle un nombre a tu configuración")
        return
    }
    
    // Guardamos solo los valores de texto/select/urls, no los archivos File
    // (Si hay imágenes subidas como "Static" que ya tienen URL pública en el formValues, se guardan)
    const { data, error } = await supabase.from('brand_presets').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        name: presetName,
        form_values: formValues
    }).select().single()

    if (error) {
        toast.error("Error al guardar preset")
    } else {
        toast.success("Configuración guardada")
        setPresets(prev => [data, ...prev])
        setShowSavePreset(false)
        setPresetName("")
    }
  }

  const handleLoadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id.toString() === presetId)
    if (preset) {
        // Fusionamos los valores guardados con el formulario actual
        setFormValues(prev => ({
            ...prev,
            ...preset.form_values
        }))
        toast.success(`Cargado: ${preset.name}`)
    }
  }

  const handleDeletePreset = async (e: React.MouseEvent, id: number) => {
      e.stopPropagation() // Para que no seleccione el preset al borrarlo
      const { error } = await supabase.from('brand_presets').delete().eq('id', id)
      if (!error) {
          setPresets(prev => prev.filter(p => p.id !== id))
          toast.success("Preset eliminado")
      }
  }

  // --- HANDLERS FORMULARIO ---
  const handleTextChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (inputName: string, files: FileList | null, allowMultiple: boolean) => {
    if (!files) return
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (newFiles.length === 0) return

    setImageFiles(prev => {
        const existing = prev[inputName] || []
        return { 
            ...prev, 
            [inputName]: allowMultiple ? [...existing, ...newFiles] : [newFiles[0]] 
        }
    })

    const newUrls = newFiles.map(f => URL.createObjectURL(f))
    setPreviews(prev => {
        const existing = prev[inputName] || []
        return {
            ...prev,
            [inputName]: allowMultiple ? [...existing, ...newUrls] : [newUrls[0]]
        }
    })
  }

  const removeFile = (inputName: string, index: number) => {
    setImageFiles(prev => ({
        ...prev,
        [inputName]: prev[inputName].filter((_, i) => i !== index)
    }))
    setPreviews(prev => {
        const urlToRemove = prev[inputName][index]
        URL.revokeObjectURL(urlToRemove)
        return {
            ...prev,
            [inputName]: prev[inputName].filter((_, i) => i !== index)
        }
    })
  }

  const handleBulkSubmit = async () => {
    // Validaciones
    for (const conf of inputConfigs) {
        if (conf.required) {
            // Si es imagen, verificamos si hay archivos NUEVOS o si ya hay una URL cargada (del preset)
            if (conf.type === 'image') {
                const hasNewFiles = imageFiles[conf.name] && imageFiles[conf.name].length > 0
                const hasExistingUrl = formValues[conf.name] && typeof formValues[conf.name] === 'string' && formValues[conf.name].startsWith('http')
                
                if (!hasNewFiles && !hasExistingUrl) {
                    toast.error(`Falta imagen: ${conf.label}`)
                    return
                }
            } else if (!formValues[conf.name]) {
                toast.error(`Falta campo: ${conf.label}`)
                return
            }
        }
    }

    setIsProcessing(true)
    setErrorCount(0)
    setCompletedCount(0)
    const batchId = crypto.randomUUID()

    try {
      let loops = 1
      let activeBatchFiles: File[] = []
      
      if (batchInputName && imageFiles[batchInputName]) {
          activeBatchFiles = imageFiles[batchInputName]
          loops = activeBatchFiles.length
      }
      setTotalItems(loops)

      // Subir Estáticas (Solo las que son archivos nuevos, si viene URL del preset la respetamos)
      const staticImageUrls: Record<string, string> = {}
      
      for (const conf of inputConfigs) {
          const isBatchField = conf.name === batchInputName
          
          // Si hay archivo nuevo para este campo
          if (conf.type === 'image' && !isBatchField && imageFiles[conf.name] && imageFiles[conf.name].length > 0) {
              const file = imageFiles[conf.name][0]
              const uniqueId = Math.random().toString(36).substring(2, 8)
              const fileName = `static_${Date.now()}_${uniqueId}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
              
              const { error } = await supabase.storage.from('uploads').upload(fileName, file, { upsert: true })
              if (!error) {
                  const { data } = supabase.storage.from('uploads').getPublicUrl(fileName)
                  staticImageUrls[conf.name] = data.publicUrl
              } else {
                  throw new Error(`Error subiendo ${conf.label}`)
              }
          }
      }

      // Procesador
      const processItem = async (index: number) => {
        try {
            // Mergeamos: Valores del form (que pueden tener URLs de presets) + Nuevas URLs estáticas subidas ahora
            const currentPayload: Record<string, any> = { 
                ...formValues, 
                ...staticImageUrls,
                _batch_id: batchId 
            }

            if (batchInputName && activeBatchFiles[index]) {
                const file = activeBatchFiles[index]
                const fileExt = file.name.split('.').pop()
                const uniqueId = Math.random().toString(36).substring(2, 8)
                let fileNameToUpload = ""

                const brandKey = Object.keys(formValues).find(k => k.toLowerCase().includes('marca') || k.toLowerCase().includes('brand'))
                const brandPrefix = brandKey ? formValues[brandKey] : "upload"

                if (shouldRename && brandPrefix) {
                    const seq = (index + 1).toString().padStart(3, '0')
                    fileNameToUpload = `${brandPrefix.replace(/\s+/g, '_')}_${seq}_${uniqueId}.${fileExt}`
                } else {
                    fileNameToUpload = `${Date.now()}_${uniqueId}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
                }

                const { error: uploadError } = await supabase.storage
                    .from('uploads')
                    .upload(fileNameToUpload, file, { upsert: true })

                if (uploadError) throw new Error(`Fallo subida imagen ${index + 1}`)

                const { data } = supabase.storage.from('uploads').getPublicUrl(fileNameToUpload)
                currentPayload[batchInputName] = data.publicUrl
            }

            const success = await onGenerate(currentPayload)
            if (success) setCompletedCount(prev => prev + 1)
            else throw new Error("API falló")

        } catch (err: any) {
            console.error(`Error item ${index}:`, err)
            setErrorCount(prev => prev + 1)
        }
      }

      // Ejecución Paralela
      const CONCURRENCY = 3
      const queue = Array.from({ length: loops }, (_, i) => i)
      const workers = Array(Math.min(loops, CONCURRENCY)).fill(null).map(async () => {
          while (queue.length > 0) {
              const idx = queue.shift()
              if (idx !== undefined) {
                  setCurrentFileIndex(idx + 1)
                  await processItem(idx)
              }
          }
      })

      await Promise.all(workers)

      if (errorCount === 0) {
          toast.success("¡Todo listo!")
          setTimeout(() => {
              onOpenChange(false)
              setIsProcessing(false)
          }, 1500)
      } else {
          toast.warning(`Finalizado con ${errorCount} errores`)
          setIsProcessing(false)
      }

    } catch (error: any) {
      console.error(error)
      toast.error("Error crítico")
      setIsProcessing(false)
    }
  }

  // --- RENDER ---
  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }, [])
  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }, [])

  return (
    <Dialog open={open} onOpenChange={(val) => !isProcessing && onOpenChange(val)}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{workflow.title}</DialogTitle>
            
            {/* BARRA DE HERRAMIENTAS DE PRESETS */}
            <div className="flex items-center gap-2">
                <Select onValueChange={handleLoadPreset}>
                    <SelectTrigger className="w-[180px] h-8 text-xs bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Cargar Preset..." />
                    </SelectTrigger>
                    <SelectContent>
                        {presets.length === 0 ? (
                            <div className="p-2 text-xs text-zinc-500">No hay guardados</div>
                        ) : (
                            presets.map(p => (
                                <div key={p.id} className="flex items-center justify-between w-full pr-2 group hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer">
                                    <SelectItem value={p.id.toString()} className="text-xs flex-1 cursor-pointer">{p.name}</SelectItem>
                                    <Trash2 
                                        className="h-3 w-3 text-zinc-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100" 
                                        onClick={(e) => handleDeletePreset(e, p.id)}
                                    />
                                </div>
                            ))
                        )}
                    </SelectContent>
                </Select>

                {showSavePreset ? (
                    <div className="flex items-center gap-1 animate-in slide-in-from-right-5 fade-in duration-200">
                        <Input 
                            className="h-8 w-32 text-xs bg-zinc-800 border-zinc-700" 
                            placeholder="Nombre..." 
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                        />
                        <Button size="sm" className="h-8 px-2" onClick={handleSavePreset}><Save className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setShowSavePreset(false)}><X className="h-3 w-3" /></Button>
                    </div>
                ) : (
                    <Button variant="outline" size="sm" className="h-8 gap-2 border-zinc-700 text-xs" onClick={() => setShowSavePreset(true)}>
                        <Save className="h-3 w-3" /> Guardar
                    </Button>
                )}
            </div>
          </div>
          <DialogDescription>Configura los parámetros o carga un preset.</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {inputConfigs.map((conf) => {
            if (conf.type === 'image') {
              const isBatch = conf.multiple === true
              const currentFiles = imageFiles[conf.name] || []
              const currentPreviews = previews[conf.name] || []
              // También verificamos si hay una URL ya cargada desde el preset
              const presetUrl = formValues[conf.name]

              return (
                <div key={conf.name} className="space-y-2">
                  <Label>
                    {conf.label} 
                    {isBatch && currentFiles.length > 0 && <span className="text-zinc-400 font-normal ml-2">({currentFiles.length} fotos)</span>}
                  </Label>
                  
                  {/* Si hay URL de preset Y no es un campo batch (el batch siempre pide fotos nuevas), mostramos la imagen guardada */}
                  {!isBatch && presetUrl && currentFiles.length === 0 && (
                      <div className="relative w-full h-24 border border-zinc-700 rounded-lg overflow-hidden group bg-black/40 flex items-center justify-between px-4">
                          <div className="flex items-center gap-4">
                              <div className="h-16 w-16 relative rounded overflow-hidden border border-zinc-600">
                                  <Image src={presetUrl} alt="Preset" fill className="object-cover" unoptimized />
                              </div>
                              <span className="text-xs text-zinc-400">Imagen cargada desde preset</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-white" onClick={() => document.getElementById(`file-${conf.name}`)?.click()}>
                              Cambiar
                          </Button>
                      </div>
                  )}

                  <div 
                      className={`relative flex flex-col items-center justify-center w-full ${isBatch ? 'h-32' : 'h-24'} border-2 border-dashed border-zinc-700 rounded-lg hover:bg-zinc-900 cursor-pointer ${(!isBatch && presetUrl && currentFiles.length === 0) ? 'hidden' : ''}`}
                      onDragOver={!isProcessing ? onDragOver : undefined}
                      onDragLeave={!isProcessing ? onDragLeave : undefined}
                      onDrop={!isProcessing ? onDrop : undefined}
                  >
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                              {isBatch ? <Upload className="w-8 h-8 mb-2 text-zinc-400" /> : <FileImage className="w-6 h-6 mb-1 text-zinc-400" />}
                              <p className="text-xs text-zinc-400 px-4 text-center">
                                {isBatch ? "Arrastrar lote de fotos" : "Subir imagen única"}
                              </p>
                          </div>
                          <input 
                            id={`file-${conf.name}`}
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            multiple={isBatch} 
                            onChange={(e) => handleImageUpload(conf.name, e.target.files, isBatch)} 
                            disabled={isProcessing} 
                          />
                      </label>
                  </div>

                  {currentFiles.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 p-2 bg-zinc-900/50 rounded max-h-32 overflow-y-auto">
                        {currentPreviews.map((src, idx) => (
                            <div key={idx} className="relative aspect-square rounded overflow-hidden group border border-zinc-700">
                                <Image src={src} alt="preview" fill className="object-cover" unoptimized />
                                {!isProcessing && (
                                    <button onClick={() => removeFile(conf.name, idx)} className="absolute top-0 right-0 bg-red-600 p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                  )}

                  {isBatch && currentFiles.length > 0 && (
                    <div className="flex items-center space-x-2 pt-1">
                        <Checkbox id="rename" checked={shouldRename} onCheckedChange={(c) => setShouldRename(c as boolean)} disabled={isProcessing} />
                        <Label htmlFor="rename" className="text-xs text-zinc-400 cursor-pointer">Renombrar secuencialmente</Label>
                    </div>
                  )}
                </div>
              )
            }

            if (conf.type === 'select') {
                return (
                    <div key={conf.name} className="space-y-2">
                        <Label>{conf.label}</Label>
                        <Select value={formValues[conf.name] || ""} onValueChange={(val) => handleTextChange(conf.name, val)} disabled={isProcessing}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-700"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                            <SelectContent>
                                {conf.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                )
            }

            if (conf.type === 'textarea') {
                return (
                    <div key={conf.name} className="space-y-2 col-span-full">
                        <Label>{conf.label}</Label>
                        <Textarea 
                            placeholder={conf.placeholder} 
                            value={formValues[conf.name] || ""} 
                            onChange={(e) => handleTextChange(conf.name, e.target.value)} 
                            disabled={isProcessing} 
                            className="bg-zinc-900 border-zinc-700 min-h-[80px]" 
                        />
                    </div>
                )
            }

            return (
                <div key={conf.name} className="space-y-2">
                    <Label>{conf.label}</Label>
                    <Input 
                        placeholder={conf.placeholder} 
                        value={formValues[conf.name] || ""} 
                        onChange={(e) => handleTextChange(conf.name, e.target.value)} 
                        disabled={isProcessing} 
                        className="bg-zinc-900 border-zinc-700"
                    />
                </div>
            )
          })}

          {isProcessing && (
              <div className="space-y-2 col-span-full bg-zinc-900 p-3 rounded border border-zinc-800">
                  <div className="flex justify-between text-sm text-white mb-2">
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        Enviando...
                      </span>
                      <span>{Math.round(((completedCount + errorCount) / (totalItems || 1)) * 100)}%</span>
                  </div>
                  <Progress value={((completedCount + errorCount) / (totalItems || 1)) * 100} className="h-2" />
                  <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-green-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {completedCount} ok</span>
                      {errorCount > 0 && <span className="text-red-500 flex items-center gap-1"><XCircle className="h-3 w-3" /> {errorCount} fallos</span>}
                  </div>
              </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleBulkSubmit} disabled={isProcessing} className="w-full">
            {isProcessing ? "Procesando..." : `Generar`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}