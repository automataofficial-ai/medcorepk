const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://jzhmytlbhlftmulwtqwv.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aG15dGxiaGxmdG11bHd0cXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjcwMzQxOCwiZXhwIjoyMDk4Mjc5NDE4fQ.lNULi3Y4lAcNu9kA3JpLuboyGCs-Q1O17mH_Kc-jsMk";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verify() {
  const { data, error } = await supabase
    .from("mcqs")
    .select("question, references, is_fcps_pearl, difficulty_level, option_e")
    .eq("question", "Which term describes the study of drug effects on the body?")
    .single();

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("✅ Imported MCQ Data:");
    console.log(JSON.stringify(data, null, 2));
    console.log("\n✓ References field:", data.references ? "✓ Stored" : "✗ Missing");
    console.log("✓ FCPS Pearl flag:", data.is_fcps_pearl ? "✓ True" : "✗ False");
    console.log("✓ Difficulty level:", data.difficulty_level || "✗ Missing");
    console.log("✓ Option E support:", data.option_e ? "✓ Available" : "✗ Not used");
  }
}

verify();
