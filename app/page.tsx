import { createClient } from "@/utils/supabase/server"

export default async function Notes() {
  // 1. Creamos el cliente
  const supabase = await createClient()

  // 2. Hacemos la consulta
  const { data: notes, error } = await supabase.from("notes").select()

  // 3. Manejo básico de errores para depurar en v0
  if (error) {
    return <pre>Error: {JSON.stringify(error, null, 2)}</pre>
  }

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
