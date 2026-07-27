import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kibbevytbobwvpmjnvnl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYmJldnl0Ym9id3ZwbWpudm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MDgyNTUsImV4cCI6MjA5Nzk4NDI1NX0.ootJTAVUpYVQwr431jz5Lu-u17MkIPXf-wI2-isDhqk";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
  const { data, error } = await supabase.from(tableName).select('*').limit(1);
  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
  } else {
    console.log(`\nTable: ${tableName}`);
    if (data.length > 0) {
      console.log('Columns:', Object.keys(data[0]).join(', '));
      console.log('Sample Data:', data[0]);
    } else {
      console.log('Table exists but is empty.');
    }
  }
}

async function run() {
  const tables = ['announcements', 'events', 'gallery', 'leadership', 'ministries', 'choir', 'missions', 'sermon'];
  for (const table of tables) {
    await checkTable(table);
  }
}

run();
