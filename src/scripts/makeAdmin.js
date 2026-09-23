require('dotenv').config();
const prisma = require('../utils/prismaClient');

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.log('Usage: npm run make-admin -- user@example.com');
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'admin' }
  });

  console.log(`${user.email} is now an admin`);
  await prisma.$disconnect();
}

makeAdmin();
