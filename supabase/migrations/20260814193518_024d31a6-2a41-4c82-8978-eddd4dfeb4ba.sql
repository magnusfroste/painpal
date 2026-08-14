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

GRANT SELECT, INSERT, UPDATE, DELETE ON public.migraine_entries TO authenticated;
GRANT ALL ON public.migraine_entries TO service_role;

ALTER TABLE public.migraine_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own migraine entries"
  ON public.migraine_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can select their own migraine entries"
  ON public.migraine_entries
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own migraine entries"
  ON public.migraine_entries
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own migraine entries"
  ON public.migraine_entries
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());