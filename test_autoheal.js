const errorMsg = "Could not find the 'isSabbathEve' column of 'events' in the schema cache";
const match = errorMsg.match(/'([^']+)' column/);
console.log(match ? match[1] : "no match");
