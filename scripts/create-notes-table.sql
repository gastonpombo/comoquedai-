-- Create notes table for testing
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read notes (for testing)
CREATE POLICY "Anyone can read notes" 
  ON notes FOR SELECT 
  USING (true);

-- Insert some test data
INSERT INTO notes (content) VALUES 
  ('Primera nota de prueba'),
  ('Segunda nota de prueba'),
  ('Tercera nota con Supabase funcionando correctamente');
