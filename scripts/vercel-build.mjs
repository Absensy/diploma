import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

run('npx prisma generate');

if (process.env.DATABASE_URL) {
  run('npx prisma migrate deploy');
} else {
  console.warn(
    '\n⚠️  DATABASE_URL is not set — skipping prisma migrate deploy.\n' +
      '   Add DATABASE_URL in Vercel → Settings → Environment Variables (Production + Preview),\n' +
      '   then redeploy. Without it the app cannot connect to the database.\n',
  );
}

run('npx next build');
