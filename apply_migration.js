const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://jzhmytlbhlftmulwtqwv.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aG15dGxiaGxmdG11bHd0cXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjcwMzQxOCwiZXhwIjoyMDk4Mjc5NDE4fQ.lNULi3Y4lAcNu9kA3JpLuboyGCs-Q1O17mH_Kc-jsMk";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyMigration() {
  try {
    console.log("Testing if references column exists...");
    
    const { data, error } = await supabase
      .from("mcqs")
      .insert([{
        block_id: "00000000-0000-0000-0000-000000000000",
        question: "__test__",
        case_study: "",
        option_a: "A",
        option_b: "B",
        option_c: "C",
        option_d: "D",
        correct_answer: "a",
        references: "Test"
      }])
      .select();
    
    if (error) {
      console.error("Error inserting record:", error.message);
      console.log("\nColumn may not exist yet. Check migration status.");
    } else {
      console.log("? References column exists and is working!");
      // Clean up
      await supabase.from("mcqs").delete().eq("question", "__test__");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

applyMigration();
