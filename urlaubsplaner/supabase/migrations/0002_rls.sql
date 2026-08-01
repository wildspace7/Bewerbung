-- Row Level Security
--
-- Ohne RLS wäre mit dem öffentlichen anon-Key jede Zeile aller Tabellen les-
-- und schreibbar. Grundregel: man sieht die Daten eines Trips genau dann, wenn
-- man Teilnehmer:in dieses Trips ist.

-- Membership-Check als SECURITY DEFINER, damit die Policies auf trips und
-- trip_participants sich nicht gegenseitig aufrufen (sonst: infinite recursion).
create or replace function public.is_trip_member(target_trip_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from trip_participants tp
    where tp.trip_id = target_trip_id
      and tp.profile_id = auth.uid()
  );
$$;

alter table profiles            enable row level security;
alter table trips               enable row level security;
alter table trip_participants   enable row level security;
alter table expenses            enable row level security;
alter table expense_splits      enable row level security;
alter table itinerary_items     enable row level security;
alter table packing_items       enable row level security;
alter table documents           enable row level security;
alter table diary_entries       enable row level security;
alter table diary_photos        enable row level security;

-- profiles: Namen/Avatare aller Nutzer sind lesbar (nötig für Teilnehmer-
-- Anzeige), schreiben darf jede:r nur das eigene Profil.
create policy "profiles_select" on profiles
  for select using (auth.uid() is not null);
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- trips: sichtbar für Teilnehmer:innen und die anlegende Person.
create policy "trips_select_member" on trips
  for select using (created_by = auth.uid() or is_trip_member(id));
create policy "trips_insert_own" on trips
  for insert with check (created_by = auth.uid());
create policy "trips_update_member" on trips
  for update using (created_by = auth.uid() or is_trip_member(id));
create policy "trips_delete_creator" on trips
  for delete using (created_by = auth.uid());

-- trip_participants: eigene Mitgliedschaft anlegen (Trip erstellen / beitreten),
-- Mitglieder sehen die Teilnehmerliste.
create policy "participants_select" on trip_participants
  for select using (profile_id = auth.uid() or is_trip_member(trip_id));
create policy "participants_insert_self" on trip_participants
  for insert with check (profile_id = auth.uid());
create policy "participants_delete_self" on trip_participants
  for delete using (profile_id = auth.uid());

-- Trip-gebundene Daten: volle Rechte für Mitglieder des jeweiligen Trips.
create policy "expenses_all_member" on expenses
  for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));

create policy "itinerary_all_member" on itinerary_items
  for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));

create policy "packing_all_member" on packing_items
  for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));

create policy "documents_all_member" on documents
  for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));

create policy "diary_entries_all_member" on diary_entries
  for all using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));

-- Splits und Fotos hängen indirekt am Trip — über ihr Elternobjekt prüfen.
create policy "expense_splits_all_member" on expense_splits
  for all using (
    exists (
      select 1 from expenses e
      where e.id = expense_splits.expense_id and is_trip_member(e.trip_id)
    )
  ) with check (
    exists (
      select 1 from expenses e
      where e.id = expense_splits.expense_id and is_trip_member(e.trip_id)
    )
  );

create policy "diary_photos_all_member" on diary_photos
  for all using (
    exists (
      select 1 from diary_entries d
      where d.id = diary_photos.diary_entry_id and is_trip_member(d.trip_id)
    )
  ) with check (
    exists (
      select 1 from diary_entries d
      where d.id = diary_photos.diary_entry_id and is_trip_member(d.trip_id)
    )
  );
