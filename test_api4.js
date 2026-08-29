async function test() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6ImRlZmF1bHQtdGVuYW50IiwidXNlcklkIjoidXNlcjEyMyIsImlhdCI6MTc4NTk0NTE2MiwiZXhwIjoxNzg1OTQ4NzYyfQ.HZhr-qYsGeV1Oy9AHcb-Infto16leThE7xXmjaTzNwo';
  const objId = 'cmsg9o0ey000c77hrq469vfbu'; // Previous object

  console.log("\nCreating Invalid Custom Record (missing price)...");
  const recRes = await fetch(`http://localhost:3008/custom-objects/${objId}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      data: {
        active: false // Missing required 'price' field
      }
    })
  });
  
  const rec = await recRes.json();
  console.log("Custom Record Response:", rec);
}

test();
