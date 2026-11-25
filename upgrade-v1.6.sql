-- Run once in Supabase SQL Editor before deploying V1.6. Idempotent.
-- Existing studio_state and skill-public remain untouched.
insert into storage.buckets (id,name,public,file_size_limit)
values ('studio-private','studio-private',false,1048576)
on conflict (id) do update set public=false, file_size_limit=1048576;
-- Immutable blocks, no browser update/delete permission. Only the authenticated owner's prefix.
drop policy if exists "studio private blocks select" on storage.objects;
create policy "studio private blocks select" on storage.objects for select to authenticated
using (bucket_id='studio-private' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "studio private blocks insert" on storage.objects;
create policy "studio private blocks insert" on storage.objects for insert to authenticated
with check (bucket_id='studio-private' and (storage.foldername(name))[1]=auth.uid()::text
 and name ~ ('^' || auth.uid()::text || '/v1/[0-9a-f]{64}$'));
