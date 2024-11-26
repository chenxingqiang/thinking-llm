-- Protocol exports history
create table protocol_exports_history (
    id uuid primary key default gen_random_uuid(),
    protocol_id uuid references protocols(id) on delete cascade not null,
    user_id uuid references auth.users(id) not null,
    format text not null,
    options jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now() not null
);

-- Add RLS policies
alter table protocol_exports_history enable row level security;

-- Protocol exports history policies
create policy "Users can view their own export history"
    on protocol_exports_history for select
    using (auth.uid() = user_id);

create policy "Users can create export history"
    on protocol_exports_history for insert
    with check (auth.uid() = user_id);

-- Add indexes
create index protocol_exports_history_protocol_id_idx on protocol_exports_history(protocol_id);
create index protocol_exports_history_user_id_idx on protocol_exports_history(user_id); 