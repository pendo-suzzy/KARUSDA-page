let attempt = 0;
let currentItem = { id: 1, title: 'Test', isSabbathEve: false };
let droppedColumns = [];

async function mockUpsert(item) {
  console.log("Mock upsert called with:", item);
  if ('isSabbathEve' in item) {
    return { error: { code: 'PGRST204', message: "Could not find the 'isSabbathEve' column of 'events' in the schema cache" } };
  }
  return { data: [item], error: null };
}

async function run() {
  while (attempt < 5) {
    const { data, error } = await mockUpsert(currentItem);

    if (error && error.code === 'PGRST204') {
      const match = error.message.match(/'([^']+)' column/);
      if (match && match[1]) {
        const missingColumn = match[1];
        console.log(`Missing column: ${missingColumn}`);
        delete currentItem[missingColumn];
        droppedColumns.push(missingColumn);
        attempt++;
        continue;
      }
    }

    if (error) throw error;
    console.log("Success data:", data);
    return data;
  }
  throw new Error("Too many retries");
}

run().catch(console.error);
