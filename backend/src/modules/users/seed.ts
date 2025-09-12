import { connectMongo } from '../../db/mongo';
import { env } from '../../config/env';
import { UsersRepo } from './repo';
import { hashPassword } from '../../core/security';
import mongoose from 'mongoose';

async function run() {
  await connectMongo();

  const users = [
    { email: 'admin@demo.dev', password: 'Admin@2025!', role: 'admin', name: 'Admin' },
    { email: 'employee@demo.dev', password: 'Employee@2025!', role: 'employee', name: 'Employee' },
    // mandatory reviewer
    { email: 'hire-me@anshumat.org', password: 'HireMe@2025!', role: 'employee', name: 'Reviewer' }
  ];

  for (const u of users) {
    const passwordHash = await hashPassword(u.password);
    await UsersRepo.upsertByEmail(u.email, { email: u.email, passwordHash, role: u.role, name: u.name });
  }

  console.log('Seeded users (admin, employee, reviewer)');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
