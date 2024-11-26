-- User profiles
create table user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    avatar_url text,
    bio text,
    website text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    preferences jsonb default '{}'::jsonb
);

-- Protocol related tables
create table protocol_categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    created_at timestamp with time zone default now() not null
);

create table protocol_tags (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    created_at timestamp with time zone default now() not null
);

create table protocol_to_tags (
    protocol_id uuid references protocols(id) on delete cascade,
    tag_id uuid references protocol_tags(id) on delete cascade,
    primary key (protocol_id, tag_id)
);

create table protocol_versions (
    id uuid primary key default gen_random_uuid(),
    protocol_id uuid references protocols(id) on delete cascade not null,
    version_number integer not null,
    content text not null,
    changes_description text,
    created_by uuid references auth.users(id) not null,
    created_at timestamp with time zone default now() not null,
    unique(protocol_id, version_number)
);

-- Collaboration tables
create table collaborators (
    protocol_id uuid references protocols(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    role text not null check (role in ('viewer', 'editor', 'admin')),
    created_at timestamp with time zone default now() not null,
    primary key (protocol_id, user_id)
);

create table protocol_likes (
    protocol_id uuid references protocols(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    created_at timestamp with time zone default now() not null,
    primary key (protocol_id, user_id)
);

create table notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    type text not null,
    content text not null,
    read boolean default false not null,
    data jsonb,
    created_at timestamp with time zone default now() not null
);

-- Add category reference to protocols
alter table protocols 
add column category_id uuid references protocol_categories(id) on delete set null;

-- Add updated_at triggers
create trigger update_user_profiles_updated_at
    before update on user_profiles
    for each row
    execute function update_updated_at_column();

-- Enable RLS
alter table user_profiles enable row level security;
alter table protocol_categories enable row level security;
alter table protocol_tags enable row level security;
alter table protocol_to_tags enable row level security;
alter table protocol_versions enable row level security;
alter table collaborators enable row level security;
alter table protocol_likes enable row level security;
alter table notifications enable row level security;

-- User profiles policies
create policy "Profiles are viewable by everyone"
    on user_profiles for select
    using (true);

create policy "Users can update their own profile"
    on user_profiles for update
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on user_profiles for insert
    with check (auth.uid() = id);

-- Protocol categories policies
create policy "Categories are viewable by everyone"
    on protocol_categories for select
    using (true);

create policy "Admins can manage categories"
    on protocol_categories for all
    using (auth.role() = 'admin');

-- Protocol tags policies
create policy "Tags are viewable by everyone"
    on protocol_tags for select
    using (true);

create policy "Authenticated users can create tags"
    on protocol_tags for insert
    with check (auth.role() = 'authenticated');

-- Protocol versions policies
create policy "Versions are viewable by everyone"
    on protocol_versions for select
    using (true);

create policy "Protocol owners can create versions"
    on protocol_versions for insert
    with check (
        exists (
            select 1 from protocols
            where id = protocol_id
            and author_id = auth.uid()
        )
    );

-- Collaborators policies
create policy "Collaborators are viewable by everyone"
    on collaborators for select
    using (true);

create policy "Protocol owners can manage collaborators"
    on collaborators for all
    using (
        exists (
            select 1 from protocols
            where id = protocol_id
            and author_id = auth.uid()
        )
    );

-- Protocol likes policies
create policy "Likes are viewable by everyone"
    on protocol_likes for select
    using (true);

create policy "Authenticated users can manage their likes"
    on protocol_likes for all
    using (auth.uid() = user_id);

-- Notifications policies
create policy "Users can view their own notifications"
    on notifications for select
    using (auth.uid() = user_id);

create policy "System can create notifications"
    on notifications for insert
    with check (auth.role() = 'service_role');

create policy "Users can update their notification status"
    on notifications for update
    using (auth.uid() = user_id);

-- Create indexes
create index user_profiles_updated_at_idx on user_profiles(updated_at);
create index protocol_versions_protocol_id_idx on protocol_versions(protocol_id);
create index protocol_versions_created_by_idx on protocol_versions(created_by);
create index notifications_user_id_read_idx on notifications(user_id, read);
create index protocols_category_id_idx on protocols(category_id);

-- 修正 protocol_to_tags 表的关联查询结构
create or replace view protocol_tags_view as
select 
    pt.protocol_id,
    json_agg(json_build_object(
        'id', t.id,
        'name', t.name
    )) as tags
from protocol_to_tags pt
join protocol_tags t on t.id = pt.tag_id
group by pt.protocol_id; 