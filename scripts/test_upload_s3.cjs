const fs = require("fs");

const ADMIN_PASS = process.env.ADMIN_PASSWORD || "TechNKT@DevPass2026!";

async function testUpload() {
  const loginRes = await fetch("http://localhost:4321/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: ADMIN_PASS }),
  });
  const loginData = await loginRes.json();
  const cookie = loginRes.headers.get("set-cookie")?.split(";")[0];
  console.log("Admin logged in:", loginData.success);

  const boundary = "----WebKitFormBoundaryTest123";
  const fakeImage = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46]);
  const bodyBuffer = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="technkt-neon-test.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
    fakeImage,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  const uploadRes = await fetch("http://localhost:4321/api/admin/upload", {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      Cookie: cookie,
      Origin: "http://localhost:4321",
    },
    body: bodyBuffer,
  });

  const uploadData = await uploadRes.json();
  console.log("Upload response:", uploadData);

  if (uploadData.success && uploadData.url) {
    const publicFetch = await fetch(uploadData.url);
    console.log("Public URL HTTP status:", publicFetch.status, "Content-Type:", publicFetch.headers.get("content-type"));
  }
}

testUpload().catch(console.error);
