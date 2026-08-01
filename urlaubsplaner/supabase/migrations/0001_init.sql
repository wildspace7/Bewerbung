-- Urlaubsplaner: initiales Datenbankschema
-- Quelle: CLAUDE.md ("Datenmodell")

create extension if not exists pgcrypto;

-- Nutzerprofil (erweitert Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users,
  name text not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- Ein Urlaub = ein Projekt
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text,
  start_date date,
  end_date date,
  currency text default 'EUR',
  status text default 'planning', -- 'planning' | 'active' | 'completed'
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Teilnehmer eines Trips
create table if not exists trip_participants (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  profile_id uuid references profiles(id),
  role text default 'member', -- 'organizer' | 'member'
  joined_at timestamptz default now()
);

-- Ausgaben
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  title text not null,
  amount numeric(10,2) not null,
  currency text default 'EUR',
  category text, -- 'flug' | 'hotel' | 'essen' | 'aktivitaet' | 'transport' | 'sonstiges'
  payment_method text default 'karte', -- 'karte' | 'bargeld'
  paid_by uuid references profiles(id),
  expense_date date default current_date,
  created_at timestamptz default now()
);

-- Aufteilung einer Ausgabe auf Teilnehmer
create table if not exists expense_splits (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid references expenses(id) on delete cascade,
  participant_id uuid references trip_participants(id),
  share_amount numeric(10,2) not null
);

-- Terminplan / Itinerary
create table if not exists itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  day_date date not null,
  start_time time,
  title text not null,
  location text,
  notes text,
  created_at timestamptz default now()
);

-- Packliste
create table if not exists packing_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  name text not null,
  category text,
  is_checked boolean default false,
  created_at timestamptz default now()
);

-- Dokumente (Tickets, Buchungen, Versicherung)
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  name text not null,
  file_url text not null,
  doc_type text, -- 'ticket' | 'buchung' | 'versicherung' | 'sonstiges'
  uploaded_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Tagebuch / Fotos (Phase 2+)
create table if not exists diary_entries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  entry_date date not null,
  text_content text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists diary_photos (
  id uuid primary key default gen_random_uuid(),
  diary_entry_id uuid references diary_entries(id) on delete cascade,
  photo_url text not null,
  caption text,
  is_favorite boolean default false,
  created_at timestamptz default now()
);
