-- Giro Certo: primeira tabela para o teste fechado com motoristas.
-- Execute este arquivo uma vez no SQL Editor do projeto girocerto-teste.
-- Apenas os valores informados na jornada são armazenados; os resultados
-- (bruto, combustível, líquido e valor/km) continuam calculados pelo app.

begin;

create table public.rides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  uber numeric(12, 2) not null default 0 check (uber >= 0),
  ninety_nine numeric(12, 2) not null default 0 check (ninety_nine >= 0),
  particular numeric(12, 2) not null default 0 check (particular >= 0),
  in_driver numeric(12, 2) not null default 0 check (in_driver >= 0),
  kilometers numeric(10, 2) not null default 0 check (kilometers >= 0),
  fuel_price numeric(10, 2) not null default 0 check (fuel_price >= 0),
  vehicle_average numeric(10, 2) not null default 0 check (vehicle_average >= 0)
);

create index rides_user_created_at_idx
  on public.rides (user_id, created_at desc);

-- O banco aplica a separação entre motoristas, mesmo que alguém altere
-- uma requisição enviada pelo aplicativo.
alter table public.rides enable row level security;
revoke all on table public.rides from public, anon, authenticated;
grant select, insert, update, delete on table public.rides to authenticated;

create policy "Motorista le suas jornadas"
  on public.rides for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Motorista cria suas jornadas"
  on public.rides for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Motorista altera suas jornadas"
  on public.rides for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Motorista exclui suas jornadas"
  on public.rides for delete to authenticated
  using ((select auth.uid()) = user_id);

commit;
