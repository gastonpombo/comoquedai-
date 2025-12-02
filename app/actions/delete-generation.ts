'use server'

import { createClient } from '@/utils/supabase/server' // Ajusta tu import de supabase
import { revalidatePath } from 'next/cache'

export async function deleteGeneration(generationId: string) {
  const supabase = await createClient()

  // Verificar usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Borrar de la base de datos
  const { error } = await supabase
    .from('generations')
    .delete()
    .eq('id', generationId)
    .eq('user_id', user.id) // Seguridad: solo borrar las propias

  if (error) {
    console.error("Error borrando:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard') // O la ruta donde esté tu galería
  return { success: true }
}