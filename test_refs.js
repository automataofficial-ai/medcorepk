const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://jzhmytlbhlftmulwtqwv.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aG15dGxiaGxmdG11bHd0cXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjcwMzQxOCwiZXhwIjoyMDk4Mjc5NDE4fQ.lNULi3Y4lAcNu9kA3JpLuboyGCs-Q1O17mH_Kc-jsMk";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function test() {
  const { error } = await supabase
    .from("mcqs")
    .insert([{
      block_id: "00000000-0000-0000-0000-000000000000",
      question: "test",
      case_study: "",
      option_a: "A",
      option_b: "B",
      option_c: "C",
      option_d: "D",
      correct_answer: "a",
      references: "Test Ref"
    }]);
  
  if (error) {
    console.log("ERROR:", error.code, error.message);
    if (error.message.includes("references")) {
      console.log("\nAction needed: The references column must be created in Supabase");
      console.log("Migration file exists at: supabase/migrations/20260713000003_add_references_column.sql");
    }
  } else {
    console.log("SUCCESS: Column exists and insert worked!");
    await supabase.from("mcqs").delete().eq("question", "test");
  }
}

test();
