
-- Create a table to store migraine/headache entries per user
CREATE TABLE public.migraine_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  "where" TEXT NOT NULL,
  amount TEXT NOT NULL,
  "when" TEXT NOT NULL,
  cause TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.migraine_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own entries
CREATE POLICY "Users can insert their own migraine entries"
  ON public.migraine_entries
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can select their own entries
CREATE POLICY "Users can select their own migraine entries"
  ON public.migraine_entries
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can update their own entries if needed
CREATE POLICY "Users can update their own migraine entries"
  ON public.migraine_entries
  FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: Users can delete their own entries if needed
CREATE POLICY "Users can delete their own migraine entries"
  ON public.migraine_entries
  FOR DELETE
  USING (user_id = auth.uid());
