-- Create tables
create table protocols (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    content text not null,
    status text not null default 'active' check (status in ('active', 'archived')),
    author_id uuid references auth.users(id),
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

create table comments (
    id uuid primary key default gen_random_uuid(),
    content text not null,
    protocol_id uuid references protocols(id) on delete cascade not null,
    author_id uuid references auth.users(id) not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

create table templates (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add triggers for updated_at
create trigger update_protocols_updated_at
    before update on protocols
    for each row
    execute function update_updated_at_column();

create trigger update_comments_updated_at
    before update on comments
    for each row
    execute function update_updated_at_column();

create trigger update_templates_updated_at
    before update on templates
    for each row
    execute function update_updated_at_column();

-- Enable RLS
alter table protocols enable row level security;
alter table comments enable row level security;
alter table templates enable row level security;

-- Protocols policies
create policy "Protocols are viewable by everyone"
    on protocols for select
    using (true);

create policy "Authenticated users can create protocols"
    on protocols for insert
    with check (auth.role() = 'authenticated');

create policy "Users can update their own protocols"
    on protocols for update
    using (auth.uid() = author_id);

create policy "Users can delete their own protocols"
    on protocols for delete
    using (auth.uid() = author_id);

-- Comments policies
create policy "Comments are viewable by everyone"
    on comments for select
    using (true);

create policy "Authenticated users can create comments"
    on comments for insert
    with check (auth.role() = 'authenticated');

create policy "Users can update their own comments"
    on comments for update
    using (auth.uid() = author_id);

create policy "Users can delete their own comments"
    on comments for delete
    using (auth.uid() = author_id);

-- Templates policies
create policy "Templates are viewable by everyone"
    on templates for select
    using (true);

create policy "Admins can create templates"
    on templates for insert
    with check (auth.role() = 'admin');

create policy "Admins can update templates"
    on templates for update
    using (auth.role() = 'admin');

create policy "Admins can delete templates"
    on templates for delete
    using (auth.role() = 'admin');

-- Create indexes
create index protocols_author_id_idx on protocols(author_id);
create index comments_protocol_id_idx on comments(protocol_id);
create index comments_author_id_idx on comments(author_id);