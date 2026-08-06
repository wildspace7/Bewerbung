-- Storage: privates Bucket für Trip-Dateien (Tagebuch-Fotos, Dokumente).
--
-- Pfadschema: {trip_id}/diary/{diary_entry_id}/{filename} bzw.
-- {trip_id}/documents/{filename} — das erste Pfadsegment ist immer die
-- Trip-UUID, geprüft über is_trip_member() aus 0002_rls.sql. Das Bucket ist
-- bewusst privat (public: false): anders als beim Einladungslink (wo die
-- unratbare Trip-UUID selbst das Geheimnis ist) können Dokumente wie
-- Versicherungsscheine oder Tickets sensible Daten enthalten. Zugriff läuft
-- über Signed URLs, die serverseitig nur für Trip-Mitglieder erzeugt werden.

insert into storage.buckets (id, name, public)
values ('trip-files', 'trip-files', false)
on conflict (id) do nothing;

create policy "trip_files_select_member" on storage.objects
  for select using (
    bucket_id = 'trip-files'
    and is_trip_member((storage.foldername(name))[1]::uuid)
  );

create policy "trip_files_insert_member" on storage.objects
  for insert with check (
    bucket_id = 'trip-files'
    and is_trip_member((storage.foldername(name))[1]::uuid)
  );

create policy "trip_files_delete_member" on storage.objects
  for delete using (
    bucket_id = 'trip-files'
    and is_trip_member((storage.foldername(name))[1]::uuid)
  );
