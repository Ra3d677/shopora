const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Manually load .env variables
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

// Use DIRECT_URL for direct database connection (more stable for local scripts)
const databaseUrl = process.env.DIRECT_URL || "postgresql://postgres.jedtcquzijwkeluyupvq:9BAZ62%21gd-s.%24G_@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

async function main() {
  const email = 'sideb9445@gmail.com';
  const newPassword = '123456789';
  
  console.log(`Hashing new password for ${email}...`);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);
  
  console.log("Connecting directly to database and updating user...");
  const updatedUser = await prisma.user.update({
    where: { email: email },
    data: { password: hash }
  });
  
  console.log("\n✅ SUCCESS! Password has been updated successfully.");
  console.log("User Email:", updatedUser.email);
  console.log("New Password Hash:", updatedUser.password);
}

main()
  .catch(e => {
    console.error("Error resetting password:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
