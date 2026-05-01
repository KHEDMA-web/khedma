// ─────────────────────────────────────────────────────────
// KHEDMA — Supabase client
// Remplace les valeurs ci-dessous par tes vraies clés Supabase
// ─────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─────────────────────────────────────────────────────────
// SCHEMA SQL — colle ceci dans l'éditeur SQL de Supabase
// ─────────────────────────────────────────────────────────
/*
-- USERS
create table users (
  id          uuid primary key default gen_random_uuid(),
  phone       text unique not null,
  name        text,
  role        text check (role in ('worker','employer')) not null,
  wilaya      text,
  skills      text[],
  bio         text,
  rating      numeric(3,1) default 0,
  missions_done int default 0,
  available   boolean default true,
  created_at  timestamptz default now()
);

-- MISSIONS
create table missions (
  id          uuid primary key default gen_random_uuid(),
  employer_id uuid references users(id),
  title       text not null,
  sector      text,
  type        text check (type in ('CDD','INTÉRIM','URGENT','JOURNALIER')),
  city        text,
  wilaya      text,
  pay         text,
  duration    text,
  description text,
  status      text default 'active' check (status in ('active','closed','filled')),
  created_at  timestamptz default now()
);

-- APPLICATIONS
create table applications (
  id          uuid primary key default gen_random_uuid(),
  mission_id  uuid references missions(id),
  worker_id   uuid references users(id),
  status      text default 'pending' check (status in ('pending','contacted','hired','rejected')),
  created_at  timestamptz default now(),
  unique(mission_id, worker_id)
);

-- CONTRACTS
create table contracts (
  id           uuid primary key default gen_random_uuid(),
  mission_id   uuid references missions(id),
  employer_id  uuid references users(id),
  worker_id    uuid references users(id),
  status       text default 'pending' check (status in ('pending','signed_employer','signed_both','cancelled')),
  otp_code     text,
  otp_expires  timestamptz,
  signed_at    timestamptz,
  pdf_url      text,
  hash         text,
  created_at   timestamptz default now()
);

-- RATINGS
create table ratings (
  id          uuid primary key default gen_random_uuid(),
  from_user   uuid references users(id),
  to_user     uuid references users(id),
  mission_id  uuid references missions(id),
  score       int check (score between 1 and 5),
  comment     text,
  created_at  timestamptz default now(),
  unique(from_user, mission_id)
);

-- Enable RLS
alter table users       enable row level security;
alter table missions    enable row level security;
alter table applications enable row level security;
alter table contracts   enable row level security;
alter table ratings     enable row level security;

-- Basic policies (à affiner selon besoins)
create policy "Public missions" on missions for select using (status = 'active');
create policy "Own profile"     on users for all using (auth.uid()::text = id::text);
*/

// ─────────────────────────────────────────────────────────
// HELPERS — fonctions réutilisables
// ─────────────────────────────────────────────────────────

export const db = {
  // Missions
  getMissions: (filters = {}) => {
    let q = supabase.from('missions').select('*, employer:users(name, rating)').eq('status', 'active').order('created_at', { ascending: false })
    if (filters.sector && filters.sector !== 'Tous') q = q.eq('sector', filters.sector)
    if (filters.type   && filters.type   !== 'Tous') q = q.eq('type', filters.type)
    if (filters.search) q = q.ilike('title', `%${filters.search}%`)
    return q
  },

  createMission: (data) =>
    supabase.from('missions').insert(data).select().single(),

  // Applications
  apply: (missionId, workerId) =>
    supabase.from('applications').insert({ mission_id: missionId, worker_id: workerId }).select().single(),

  getMyApplications: (workerId) =>
    supabase.from('applications').select('*, mission:missions(*)').eq('worker_id', workerId),

  getMissionApplicants: (missionId) =>
    supabase.from('applications').select('*, worker:users(*)').eq('mission_id', missionId),

  // Contracts
  createContract: (data) =>
    supabase.from('contracts').insert(data).select().single(),

  getContract: (id) =>
    supabase.from('contracts').select('*, mission:missions(*), employer:users!employer_id(*), worker:users!worker_id(*)').eq('id', id).single(),

  signContract: (id, hash) =>
    supabase.from('contracts').update({ status: 'signed_both', signed_at: new Date().toISOString(), hash }).eq('id', id),

  // Users
  getUser: (id) =>
    supabase.from('users').select('*').eq('id', id).single(),

  updateUser: (id, data) =>
    supabase.from('users').update(data).eq('id', id),

  upsertUser: (data) =>
    supabase.from('users').upsert(data).select().single(),
}
