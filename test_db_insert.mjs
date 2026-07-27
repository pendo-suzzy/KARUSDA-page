import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kibbevytbobwvpmjnvnl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYmJldnl0Ym9id3ZwbWpudm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MDgyNTUsImV4cCI6MjA5Nzk4NDI1NX0.ootJTAVUpYVQwr431jz5Lu-u17MkIPXf-wI2-isDhqk";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testEvents() {
  console.log("Testing insert to events...");
  const payload = {
    id: "test-event-1",
    title: "Test Event",
    date: "2026-08-01",
    time: "10:00",
    location: "Church",
    description: "Testing",
    category: "services",
    isSabbathEve: false,
    imageurl: "https://test",
    imageupload: "https://test",
    documenturl: "https://test"
  };
  
  const { data, error } = await supabase.from('events').upsert(payload, { onConflict: ["id"] });
  if (error) {
    console.error("Events insert failed:", error);
  } else {
    console.log("Events insert succeeded:", data);
  }
}
testEvents();
