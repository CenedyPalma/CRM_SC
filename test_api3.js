async function test() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6ImRlZmF1bHQtdGVuYW50IiwidXNlcklkIjoidXNlcjEyMyIsImlhdCI6MTc4NTk0NTE2MiwiZXhwIjoxNzg1OTQ4NzYyfQ.HZhr-qYsGeV1Oy9AHcb-Infto16leThE7xXmjaTzNwo';
  
  console.log("Creating Custom Object...");
  const res = await fetch('http://localhost:3008/custom-objects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: "Product",
      pluralName: "Products",
      apiName: "product_" + Date.now(),
      description: "A product in the catalog",
      fields: [
        { name: "Price", apiName: "price", fieldType: "NUMBER", isRequired: true },
        { name: "Active", apiName: "active", fieldType: "BOOLEAN", isRequired: false }
      ]
    })
  });
  
  const obj = await res.json();
  console.log("Custom Object Response:", obj);
  
  if (!obj.id) return;

  console.log("\nCreating Custom Record...");
  const recRes = await fetch(`http://localhost:3008/custom-objects/${obj.id}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      data: {
        price: 99.99,
        active: true
      }
    })
  });
  
  const rec = await recRes.json();
  console.log("Custom Record Response:", rec);
  
  console.log("\nFetching Records...");
  const listRes = await fetch(`http://localhost:3008/custom-objects/${obj.id}/records`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log("Records:", await listRes.json());
}

test();
