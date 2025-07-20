import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bprtkovcgqyakkupohmd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwcnRrb3ZjZ3F5YWtrdXBvaG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDE4MjcsImV4cCI6MjA2ODU3NzgyN30.vgSaoY-B-GObxHm4IUOdWBIW4PCppBjTIw84-IPSSDE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
