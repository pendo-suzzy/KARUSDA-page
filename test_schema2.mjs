import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kibbevytbobwvpmjnvnl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYmJldnl0Ym9id3ZwbWpudm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MDgyNTUsImV4cCI6MjA5Nzk4NDI1NX0.ootJTAVUpYVQwr431jz5Lu-u17MkIPXf-wI2-isDhqk";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testColumn(table, column) {
  const payload = { id: "test" };
  payload[column] = "test";
  const { error } = await supabase.from(table).upsert(payload, { onConflict: ["id"] });
  if (error && error.code === 'PGRST204') {
    console.log(`${table} is missing column: ${column}`);
  } else if (error && error.code === '42501') {
    console.log(`${table} HAS column: ${column}`);
  } else {
    console.log(`${table} test for ${column} result:`, error.code, error.message);
  }
}

async function run() {
  const missionsCols = ['id', 'title', 'year', 'summary', 'goalKes', 'raisedKes', 'upcoming', 'documenturl'];
  console.log("Checking missions...");
  for (const col of missionsCols) {
    await testColumn('missions', col);
  }
}
run();
