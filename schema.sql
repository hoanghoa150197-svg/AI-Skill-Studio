-- Run in Supabase SQL Editor. Only use publishable/anon key on frontend.
create table if not exists public.studio_state (
 owner uuid primary key references auth.users(id) on delete cascade,
 revision text not null,
 payload jsonb not null
);
alter table public.studio_state enable row level security;
do $$ begin if not exists (select 1 from pg_policies where schemaname='public' and tablename='studio_state' and policyname='studio owner select') then create policy "studio owner select" on public.studio_state for select to authenticated using (owner=auth.uid()); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='public' and tablename='studio_state' and policyname='studio owner insert') then create policy "studio owner insert" on public.studio_state for insert to authenticated with check (owner=auth.uid()); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='public' and tablename='studio_state' and policyname='studio owner update') then create policy "studio owner update" on public.studio_state for update to authenticated using (owner=auth.uid()) with check (owner=auth.uid()); end if; end $$;
insert into storage.buckets(id,name,public) values ('skill-public','skill-public',true) on conflict (id) do nothing;
do $$ begin if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public skill owner select') then create policy "public skill owner select" on storage.objects for select to authenticated using (bucket_id='skill-public' and (storage.foldername(name))[1]=auth.uid()::text); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public skill owner insert') then create policy "public skill owner insert" on storage.objects for insert to authenticated with check (bucket_id='skill-public' and (storage.foldername(name))[1]=auth.uid()::text); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public skill owner update') then create policy "public skill owner update" on storage.objects for update to authenticated using (bucket_id='skill-public' and (storage.foldername(name))[1]=auth.uid()::text) with check (bucket_id='skill-public' and (storage.foldername(name))[1]=auth.uid()::text); end if; end $$;
do $$ begin if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public skill owner delete') then create policy "public skill owner delete" on storage.objects for delete to authenticated using (bucket_id='skill-public' and (storage.foldername(name))[1]=auth.uid()::text); end if; end $$;
grant select, insert, update on public.studio_state to authenticated;
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
