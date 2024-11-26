-- Drop table if exists
drop table if exists templates cascade;

-- Create templates table
create table templates (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    content text not null,
    category text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    user_id uuid references auth.users(id)
);

-- Add template_id to protocols table if not exists
do $$ 
begin
    if not exists (select 1 from information_schema.columns 
                  where table_name = 'protocols' and column_name = 'template_id') then
        alter table protocols add column template_id uuid references templates(id);
    end if;
end $$;

-- Enable RLS
alter table templates enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Templates are viewable by everyone" on templates;
drop policy if exists "Anyone can create templates" on templates;
drop policy if exists "Anyone can update templates" on templates;
drop policy if exists "Anyone can delete templates" on templates;

-- Templates policies
create policy "Templates are viewable by everyone"
    on templates for select
    using (true);

create policy "Anyone can create templates"
    on templates for insert
    to anon, authenticated
    with check (true);

create policy "Anyone can update templates"
    on templates for update
    to anon, authenticated
    using (true);

create policy "Anyone can delete templates"
    on templates for delete
    to anon, authenticated
    using (true);

-- Add some sample templates
insert into templates (title, description, content, category) values
('Basic Thinking Protocol', 'A simple template for general thinking', '# Problem Statement\n\n# Key Considerations\n\n# Analysis\n\n# Conclusion', 'General'),
('Decision Making Framework', 'Template for making important decisions', '# Decision Context\n\n# Options\n\n# Criteria\n\n# Evaluation\n\n# Decision & Rationale', 'Decision Making'),
('Problem Solving Template', 'Structured approach to problem solving', '# Problem Definition\n\n# Root Cause Analysis\n\n# Potential Solutions\n\n# Implementation Plan\n\n# Success Metrics', 'Problem Solving');
