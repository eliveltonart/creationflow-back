/**
 * Script para promover um usuário existente a Super Admin da plataforma.
 *
 * Uso:
 *   npx ts-node prisma/seed-admin.ts <email>
 *
 * Exemplo:
 *   npx ts-node prisma/seed-admin.ts contato@creationflow.com.br
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌  Informe o e-mail: npx ts-node prisma/seed-admin.ts <email>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`❌  Usuário com e-mail "${email}" não encontrado.`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { email },
    data: { isSuperAdmin: true },
  });

  console.log(`✅  Usuário "${user.name}" (${email}) agora é Super Admin.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
