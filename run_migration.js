const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://jzhmytlbhlftmulwtqwv.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aG15dGxiaGxmdG11bHd0cXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjcwMzQxOCwiZXhwIjoyMDk4Mjc5NDE4fQ.lNULi3Y4lAcNu9kA3JpLuboyGCs-Q1O17mH_Kc-jsMk";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: "public" },
});

async function runMigration() {
  try {
    console.log("Attempting to apply migration...");
    
    const sql = 
      ALTER TABLE public.mcqs
      ADD COLUMN IF NOT EXISTS references TEXT;
      
      CREATE INDEX IF NOT EXISTS idx_mcqs_references ON public.mcqs(references);
    ;
    
    // Try using rpc to execute SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sql }).catch(() => ({ data: null, error: { message: "RPC method not available" } }));
    
    if (error) {
      console.log("RPC method not available, trying direct method...");
      // The migration file should be pushed manually through Supabase dashboard or CLI
      console.log("Please apply the migration through Supabase dashboard:");
      console.log("1. Go to SQL Editor in Supabase dashboard");
      console.log("2. Run: ALTER TABLE public.mcqs ADD COLUMN IF NOT EXISTS references TEXT;");
      console.log("3. Run: CREATE INDEX IF NOT EXISTS idx_mcqs_references ON public.mcqs(references);");
    } else {
      console.log("? Migration applied successfully!");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

runMigration();
