/**
 * Bootstrap Super Admin
 * Cria ou atualiza o usuário super admin da plataforma CreationFlow.
 *
 * Uso:
 *   npx ts-node prisma/bootstrap-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'eli@thecreators.com.br';
  const name = 'Eli';
  const password = 'El@11041992';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      isSuperAdmin: true,
      isActive: true,
      password: hashedPassword,
    },
    create: {
      email,
      name,
      password: hashedPassword,
      isSuperAdmin: true,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isSuperAdmin: true,
      isActive: true,
      createdAt: true,
    },
  });

  console.log('✅ Super Admin configurado com sucesso:');
  console.log(`   ID:    ${user.id}`);
  console.log(`   Nome:  ${user.name}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Admin: ${user.isSuperAdmin}`);
  console.log(`   Ativo: ${user.isActive}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
