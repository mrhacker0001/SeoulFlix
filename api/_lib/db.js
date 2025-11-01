import { Pool } from 'pg';

let pool;
let initPromise;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

export async function query(text, params) {
  const p = getPool();
  return p.query(text, params);
}

async function initSchema() {
  await query(`
    create table if not exists dramas (
      id text primary key,
      title text not null,
      description text,
      thumbnail text not null,
      lang text default 'uz',
      upload_date timestamptz default now()
    );

    create table if not exists episodes (
      id text primary key,
      drama_id text not null references dramas(id) on delete cascade,
      season text,
      episode text,
      video_id text,
      upload_date timestamptz default now()
    );

    create table if not exists likes (
      drama_id text not null references dramas(id) on delete cascade,
      user_id text not null,
      primary key (drama_id, user_id)
    );

    create table if not exists comments (
      id text primary key,
      drama_id text not null references dramas(id) on delete cascade,
      user_name text,
      text text not null,
      created_at timestamptz default now()
    );
  `);
}

export function init() {
  if (!initPromise) {
    initPromise = initSchema().catch((e) => {
      // Surface initialization errors once
      console.error('DB init error', e);
      throw e;
    });
  }
  return initPromise;
}

export function genId() {
  return Math.random().toString(36).slice(2, 10);
}
