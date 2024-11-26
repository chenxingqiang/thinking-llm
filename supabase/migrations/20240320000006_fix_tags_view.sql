-- Drop existing view if exists
drop view if exists protocol_tags_view;

-- Create a new view for protocol tags
create or replace view protocol_tags_view as
select 
    pt.protocol_id,
    t.id as tag_id,
    t.name as tag_name
from protocol_to_tags pt
join protocol_tags t on t.id = pt.tag_id;

-- Create a new view for template tags
create or replace view template_tags_view as
select 
    tt.template_id,
    t.id as tag_id,
    t.name as tag_name
from template_to_tags tt
join protocol_tags t on t.id = tt.tag_id;

-- Update protocol_to_tags table structure
alter table protocol_to_tags 
drop column if exists tag,
add column if not exists tag_id uuid references protocol_tags(id) on delete cascade;

-- Update template_to_tags table structure
alter table template_to_tags
drop column if exists tag,
add column if not exists tag_id uuid references protocol_tags(id) on delete cascade; 