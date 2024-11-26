-- Create activities table
create table if not exists activities (
    id uuid primary key default gen_random_uuid(),
    type text not null check (type in ('create', 'edit', 'delete')),
    protocol_id uuid references protocols(id) on delete cascade not null,
    protocol_title text not null,
    user_id uuid references auth.users(id),
    created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table activities enable row level security;

-- Activities policies
drop policy if exists "Activities are viewable by everyone" on activities;
create policy "Activities are viewable by everyone"
    on activities for select
    using (true);

drop policy if exists "Anyone can create activities" on activities;
create policy "Anyone can create activities"
    on activities for insert
    to anon, authenticated
    with check (true);

-- Update protocols policies
drop policy if exists "Users can delete their own protocols" on protocols;
create policy "Anyone can delete protocols"
    on protocols for delete
    to anon, authenticated
    using (true);

drop policy if exists "Users can update their own protocols" on protocols;
create policy "Anyone can update protocols"
    on protocols for update
    to anon, authenticated
    using (true);

drop policy if exists "Authenticated users can create protocols" on protocols;
create policy "Anyone can create protocols"
    on protocols for insert
    to anon, authenticated
    with check (true);
