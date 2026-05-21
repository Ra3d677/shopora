const { Resend } = require("resend");

async function test() {
  const apiKey = process.env.RESEND_API_KEY || "re_dNKmqw9M_9sk642v7oB32ad6mPyYJ6urL";
  const resend = new Resend(apiKey);
  
  console.log("Testing with API Key:", apiKey.substring(0, 8) + "...");
  
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "shehabhamdy100100@gmail.com", // This should succeed!
      subject: "Test Email",
      html: "<p>This is a test</p>"
    });
    console.log("Response:", response);
  } catch (error) {
    console.error("Exception:", error);
  }
}

test();
