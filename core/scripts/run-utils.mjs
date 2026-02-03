import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function copyDir(sourceDir, targetDir) {
  ensureDir(dirname(targetDir));
  cpSync(sourceDir, targetDir, { recursive: true });
}

function copyTemplate({ templateDir, targetDir }) {
  if (!templateDir || !existsSync(templateDir)) return false;
  copyDir(templateDir, targetDir);
  return true;
}

function writeAuditEvent({ projectPath, pipeline, phase, status, message, data = {} }) {
  const auditDir = join(projectPath, '.appfactory');
  ensureDir(auditDir);
  const logPath = join(auditDir, 'audit.log');
  const entry = {
    timestamp: new Date().toISOString(),
    pipeline,
    phase,
    status,
    message,
    data
  };
  writeFileSync(logPath, JSON.stringify(entry) + '\n', { flag: 'a' });
}

function runLocalProof({
  proofScript,
  projectPath,
  port,
  skipBuild = false,
  skipInstall = false,
  open = false,
  extraArgs = []
}) {
  const args = [
    'node',
    `"${proofScript}"`,
    '--cwd',
    `"${projectPath}"`,
    '--port',
    `${port}`
  ];

  if (skipBuild) args.push('--skip-build');
  if (skipInstall) args.push('--skip-install');
  if (open) args.push('--open');
  if (extraArgs.length) args.push(...extraArgs);

  execSync(args.join(' '), { stdio: 'inherit' });
}

function checkRunCertificate(projectPath) {
  const certPath = join(projectPath, '.appfactory', 'RUN_CERTIFICATE.json');
  const failPath = join(projectPath, '.appfactory', 'RUN_FAILURE.json');

  if (existsSync(failPath)) {
    try {
      const failure = JSON.parse(readFileSync(failPath, 'utf-8'));
      return { ok: false, error: failure?.error || 'Verification failed', path: failPath };
    } catch (err) {
      return { ok: false, error: 'RUN_FAILURE.json exists but could not be read', path: failPath };
    }
  }

  if (!existsSync(certPath)) {
    return { ok: false, error: 'RUN_CERTIFICATE.json not found', path: certPath };
  }

  try {
    const cert = JSON.parse(readFileSync(certPath, 'utf-8'));
    if (cert.status !== 'PASS') {
      return { ok: false, error: `Certificate status: ${cert.status}`, path: certPath };
    }
    return { ok: true, path: certPath };
  } catch (err) {
    return { ok: false, error: 'RUN_CERTIFICATE.json exists but could not be parsed', path: certPath };
  }
}

export {
  ensureDir,
  copyDir,
  copyTemplate,
  writeAuditEvent,
  runLocalProof,
  checkRunCertificate
};
