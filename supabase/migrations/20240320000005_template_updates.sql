-- Add missing fields to templates table
alter table templates
add column description text,
add column author_id uuid references auth.users(id);

-- Add template tags table and relations
create table template_to_tags (
    template_id uuid references templates(id) on delete cascade,
    tag_id uuid references protocol_tags(id) on delete cascade,
    primary key (template_id, tag_id)
);

-- Add RLS policies
alter table template_to_tags enable row level security;

create policy "Template tags are viewable by everyone"
    on template_to_tags for select
    using (true);

create policy "Template owners can manage tags"
    on template_to_tags for all
    using (
        exists (
            select 1 from templates
            where id = template_id
            and author_id = auth.uid()
        )
    );

-- Add indexes
create index template_to_tags_template_id_idx on template_to_tags(template_id);
create index template_to_tags_tag_id_idx on template_to_tags(tag_id); 