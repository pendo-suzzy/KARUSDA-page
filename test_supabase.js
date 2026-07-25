import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from('announcements')
    .upsert({ id: 'test-123', title: 'Test', body: 'Test body', date: new Date().toISOString(), imageUrl: '', documentUrl: '', likes: 0 }, { onConflict: ["id"] });
  
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Success:", data);
  }
}
test();
