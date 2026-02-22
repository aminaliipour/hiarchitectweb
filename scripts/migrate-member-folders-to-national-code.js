/**
 * Migration: Rename member file folders from name-based to national_code-based
 * - From: public/files/{first}_{last}
 * - To:   public/files/{national_code}
 *
 * Safe to run multiple times. Skips if destination exists.
 *
 * Usage (Windows PowerShell):
 *   node scripts/migrate-member-folders-to-national-code.js
 */

const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function main() {
  const base = path.join(process.cwd(), 'public', 'files');
  if (!fs.existsSync(base)) {
    console.log('No files base folder found:', base);
    return;
  }

  console.log('Scanning members from DB...');
  const res = await pool.query('SELECT id, first_name, last_name, national_code FROM members');
  const members = res.rows;
  console.log(`Found ${members.length} members`);

  let migrated = 0, skipped = 0, missing = 0;

  for (const m of members) {
    const legacy = `${m.first_name || ''}_${m.last_name || ''}`
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\w\-\.]/g, '_');
    const legacyPath = path.join(base, legacy);

    const nc = (m.national_code || '').toString().trim().replace(/[^0-9]/g, '');
    if (!nc) { continue; }
    const ncPath = path.join(base, nc);

    const legacyExists = fs.existsSync(legacyPath);
    const ncExists = fs.existsSync(ncPath);

    if (!legacyExists && !ncExists) {
      missing++;
      console.log('Missing both folders for:', m.first_name, m.last_name, nc);
      continue;
    }

    if (ncExists) {
      skipped++;
      if (legacyExists) {
        // Optionally remove empty legacy folder
        try {
          const files = fs.readdirSync(legacyPath);
          if (files.length === 0) {
            fs.rmSync(legacyPath, { recursive: true, force: true });
            console.log('Removed empty legacy folder:', legacyPath);
          }
        } catch {}
      }
      continue;
    }

    try {
      fs.renameSync(legacyPath, ncPath);
      migrated++;
      console.log(`Renamed: ${legacy} -> ${nc}`);
    } catch (err) {
      console.error('Failed to rename', legacyPath, 'to', ncPath, err.message);
    }
  }

  console.log('--- Summary ---');
  console.log('Migrated:', migrated);
  console.log('Skipped (already on NC):', skipped);
  console.log('Missing folders:', missing);

  await pool.end();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
