import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kibbevytbobwvpmjnvnl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYmJldnl0Ym9id3ZwbWpudm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MDgyNTUsImV4cCI6MjA5Nzk4NDI1NX0.ootJTAVUpYVQwr431jz5Lu-u17MkIPXf-wI2-isDhqk";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testType(table, column) {
  const payload = { id: "test-type" };
  payload[column] = "invalid_date_format_test";
  const { error } = await supabase.from(table).upsert(payload, { onConflict: ["id"] });
  if (error && error.code === '22007') {
    console.log(`${table}.${column} is STRICT`);
  } else {
    console.log(`${table}.${column} is loosely typed (accepts text).`);
  }
}

async function run() {
  await testType('announcements', 'date');
  await testType('events', 'date');
  await testType('events', 'time');
  await testType('sermon', 'date');
  await testType('choir', 'date');
}
run();
