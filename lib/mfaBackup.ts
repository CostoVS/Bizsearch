import fs from 'fs';
import path from 'path';
import prisma from './prisma';

const BACKUP_DIR = path.join(process.cwd(), 'data');
const BACKUP_FILE = path.join(BACKUP_DIR, 'mfa_backup.json');
const ALT_BACKUP_FILE = '/tmp/bizsearch_mfa_backup.json';

interface MfaData {
  twoFactorSecret: string | null;
  twoFactorEnabled: boolean;
}

interface MfaBackupSchema {
  [email: string]: MfaData;
}

function getBackupPath(): string {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    return BACKUP_FILE;
  } catch {
    return ALT_BACKUP_FILE;
  }
}

export function readMfaBackup(): MfaBackupSchema {
  const file = getBackupPath();
  try {
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    // Fail silently
  }

  try {
    if (fs.existsSync(ALT_BACKUP_FILE)) {
      const data = fs.readFileSync(ALT_BACKUP_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    // Fail silently
  }

  return {};
}

export function saveMfaBackup(backup: MfaBackupSchema) {
  const file = getBackupPath();
  try {
    fs.writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8');
  } catch (e) {
    try {
      fs.writeFileSync(ALT_BACKUP_FILE, JSON.stringify(backup, null, 2), 'utf-8');
    } catch (e2) {
      console.error('Failed to write MFA backup completely:', e2);
    }
  }
}

export async function restoreMfa(user: any): Promise<any> {
  if (!user) return user;
  const backup = readMfaBackup();
  const key = user.email.toLowerCase();
  const backupData = backup[key];

  if (backupData) {
    let needsUpdate = false;
    const updateData: any = {};

    if (!user.twoFactorSecret && backupData.twoFactorSecret) {
      updateData.twoFactorSecret = backupData.twoFactorSecret;
      needsUpdate = true;
    }
    if (!user.twoFactorEnabled && backupData.twoFactorEnabled) {
      updateData.twoFactorEnabled = backupData.twoFactorEnabled;
      needsUpdate = true;
    }

    if (needsUpdate) {
      try {
        const updated = await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });
        return { ...user, ...updated };
      } catch (err) {
        // Fallback for returning updated object even if database failed to write (e.g. read-only or in-memory backup mode)
        return { ...user, ...updateData };
      }
    }
  }
  return user;
}

export function backupMfa(email: string, secret: string | null, enabled: boolean) {
  if (!email) return;
  const backup = readMfaBackup();
  const key = email.toLowerCase();
  
  backup[key] = {
    twoFactorSecret: secret,
    twoFactorEnabled: enabled
  };
  
  saveMfaBackup(backup);
}
