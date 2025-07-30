// Test Supabase Connection
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ujjjeiukcjjktllojtai.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqamplaXVrY2pqa3RsbG9qdGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDg4MDUsImV4cCI6MjA2OTQyNDgwNX0.Xmt54WnvpyHlfLqd1pw1Pm9yVlFip5FnWTytlkaFV24";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log("Testing Supabase connection...");
    console.log("URL:", supabaseUrl);
    console.log("Key:", supabaseKey.substring(0, 50) + "...");

    // Test basic connection
    const { data, error } = await supabase
      .from("crewmates")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("Connection error:", error);
      return false;
    }

    console.log("✅ Supabase connection successful!");
    console.log("Crewmates count:", data);
    return true;
  } catch (err) {
    console.error("❌ Connection failed:", err);
    return false;
  }
}

testConnection();
