const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://jzhmytlbhlftmulwtqwv.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aG15dGxiaGxmdG11bHd0cXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjcwMzQxOCwiZXhwIjoyMDk4Mjc5NDE4fQ.lNULi3Y4lAcNu9kA3JpLuboyGCs-Q1O17mH_Kc-jsMk";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testColumns() {
  try {
    console.log("Checking mcqs table columns...");
    
    // Try to describe the table using information_schema
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_name", "mcqs")
      .eq("table_schema", "public")
      .catch(() => ({ data: null, error: { message: "RPC method not available" } }));
    
    if (error) {
      console.log("Cannot check columns via Supabase API");
      console.log("Attempting to insert with references field...");
      
      const { error: insertError } = await supabase
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
          references: "test"
        }]);
      
      if (insertError && insertError.message.includes("references")) {
        console.log("COLUMN MISSING: references column not found");
        console.log("You must run the migration manually through Supabase SQL Editor");
      } else if (insertError) {
        console.log("Insert error:", insertError.message);
      } else {
        console.log("SUCCESS: references column exists!");
        await supabase.from("mcqs").delete().eq("question", "test");
      }
    } else {
      console.log("Columns:", data.map(c => c.column_name));
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testColumns();
