return (
  <Router>
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          ...
        </Routes>
      </Box>
    </Box>
  </Router>
)-- Create thinking models table
create table if not exists thinking_models (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    api_key_required boolean default true,
    api_base_url text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Create thinking steps table
create table if not exists thinking_steps (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    content text not null,
    order_index integer not null,
    template_id uuid references templates(id) on delete cascade,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    unique (template_id, order_index)
);

-- Create thinking guidelines table
create table if not exists thinking_guidelines (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    content text not null,
    template_id uuid references templates(id) on delete cascade,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Create thinking frameworks table
create table if not exists thinking_frameworks (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    content text not null,
    template_id uuid references templates(id) on delete cascade,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table thinking_models enable row level security;
alter table thinking_steps enable row level security;
alter table thinking_guidelines enable row level security;
alter table thinking_frameworks enable row level security;

-- Create policies
create policy "Thinking models are viewable by everyone"
    on thinking_models for select
    using (true);

create policy "Anyone can create thinking models"
    on thinking_models for insert
    to anon, authenticated
    with check (true);

create policy "Anyone can update thinking models"
    on thinking_models for update
    to anon, authenticated
    using (true);

create policy "Anyone can delete thinking models"
    on thinking_models for delete
    to anon, authenticated
    using (true);

create policy "Thinking steps are viewable by everyone"
    on thinking_steps for select
    using (true);

create policy "Anyone can create thinking steps"
    on thinking_steps for insert
    to anon, authenticated
    with check (true);

create policy "Anyone can update thinking steps"
    on thinking_steps for update
    to anon, authenticated
    using (true);

create policy "Anyone can delete thinking steps"
    on thinking_steps for delete
    to anon, authenticated
    using (true);

create policy "Thinking guidelines are viewable by everyone"
    on thinking_guidelines for select
    using (true);

create policy "Anyone can create thinking guidelines"
    on thinking_guidelines for insert
    to anon, authenticated
    with check (true);

create policy "Anyone can update thinking guidelines"
    on thinking_guidelines for update
    to anon, authenticated
    using (true);

create policy "Anyone can delete thinking guidelines"
    on thinking_guidelines for delete
    to anon, authenticated
    using (true);

create policy "Thinking frameworks are viewable by everyone"
    on thinking_frameworks for select
    using (true);

create policy "Anyone can create thinking frameworks"
    on thinking_frameworks for insert
    to anon, authenticated
    with check (true);

create policy "Anyone can update thinking frameworks"
    on thinking_frameworks for update
    to anon, authenticated
    using (true);

create policy "Anyone can delete thinking frameworks"
    on thinking_frameworks for delete
    to anon, authenticated
    using (true);

-- Insert default thinking models
insert into thinking_models (name, description, api_key_required, api_base_url) values
('OpenAI GPT-4', 'OpenAI GPT-4 large language model', true, 'https://api.openai.com/v1'),
('OpenAI GPT-3.5', 'OpenAI GPT-3.5-turbo language model', true, 'https://api.openai.com/v1'),
('Claude 2', 'Anthropic Claude 2 language model', true, 'https://api.anthropic.com/v1'),
('Claude 3', 'Anthropic Claude 3 language model', true, 'https://api.anthropic.com/v1'),
('Qianwen', 'Alibaba Qianwen language model', true, 'https://dashscope.aliyuncs.com/api/v1'),
('DeepSeek', 'DeepSeek language model', true, 'https://api.deepseek.com/v1'),
('ChatGLM', 'Zhipu AI ChatGLM language model', true, 'https://open.bigmodel.cn/api/v1');

-- Create a basic thinking template
with template as (
    insert into templates (title, description, content, category) values
    ('Anthropic Thinking Protocol', 'A comprehensive thinking protocol based on Anthropic''s approach', 
    '# Initial Engagement
- Rephrase the task
- Form preliminary impressions
- Consider broader context
- Map known/unknown elements
- Consider user intent
- Identify relevant knowledge
- Note ambiguities

# Problem Analysis
- Break down core components
- Identify requirements
- Consider constraints
- Define success criteria
- Map knowledge scope

# Solution Development
- Generate multiple approaches
- Consider alternatives
- Test assumptions
- Build understanding
- Synthesize insights

# Response Preparation
- Ensure completeness
- Check clarity
- Consider follow-ups
- Verify accuracy', 
    'Thinking Framework')
    returning id
)
insert into thinking_steps (name, description, content, order_index, template_id)
select 'Initial Engagement',
       'First step in the thinking process',
       '1. First clearly rephrase the human message in your own words
2. Form preliminary impressions about what is being asked
3. Consider the broader context of the question
4. Map out known and unknown elements
5. Think about why the human might ask this question
6. Identify any immediate connections to relevant knowledge
7. Identify any potential ambiguities that need clarification',
       1,
       id
from template
union all
select 'Problem Analysis',
       'Breaking down and analyzing the problem',
       '1. Break down the question or task into its core components
2. Identify explicit and implicit requirements
3. Consider any constraints or limitations
4. Think about what a successful response would look like
5. Map out the scope of knowledge needed to address the query',
       2,
       id
from template
union all
select 'Multiple Hypotheses',
       'Generating and considering multiple approaches',
       '1. Write multiple possible interpretations of the question
2. Consider various solution approaches
3. Think about potential alternative perspectives
4. Keep multiple working hypotheses active
5. Avoid premature commitment to a single interpretation
6. Consider non-obvious or unconventional interpretations
7. Look for creative combinations of different approaches',
       3,
       id
from template
union all
select 'Natural Discovery',
       'Following a natural flow of discovery',
       '1. Start with obvious aspects
2. Notice patterns or connections
3. Question initial assumptions
4. Make new connections
5. Circle back to earlier thoughts with new understanding
6. Build progressively deeper insights
7. Be open to serendipitous insights
8. Follow interesting tangents while maintaining focus',
       4,
       id
from template;

-- Insert thinking guidelines
with template as (
    select id from templates where title = 'Anthropic Thinking Protocol' limit 1
)
insert into thinking_guidelines (title, description, content, template_id)
select 'Natural Language',
       'Guidelines for natural language expression',
       'Use natural phrases that show genuine thinking:
- "Hmm..."
- "This is interesting because..."
- "Wait, let me think about..."
- "Actually..."
- "Now that I look at it..."
- "This reminds me of..."
- "I wonder if..."
- "But then again..."
- "Let me see if..."
- "This might mean that..."',
       id
from template
union all
select 'Progressive Understanding',
       'Guidelines for building understanding',
       '1. Start with basic observations
2. Develop deeper insights gradually
3. Show genuine moments of realization
4. Demonstrate evolving comprehension
5. Connect new insights to previous understanding',
       id
from template;

-- Insert thinking frameworks
with template as (
    select id from templates where title = 'Anthropic Thinking Protocol' limit 1
)
insert into thinking_frameworks (name, description, content, template_id)
select 'Adaptive Thinking',
       'Framework for adapting thinking style',
       'Adapt thinking process based on:
1. Query complexity
2. Stakes involved
3. Time sensitivity
4. Available information
5. User needs
6. Technical vs. non-technical content
7. Emotional vs. analytical context
8. Single vs. multiple document analysis
9. Abstract vs. concrete problems
10. Theoretical vs. practical questions',
       id
from template
union all
select 'Quality Control',
       'Framework for ensuring quality',
       '1. Cross-check conclusions against evidence
2. Verify logical consistency
3. Test edge cases
4. Challenge assumptions
5. Look for potential counter-examples
6. Ensure completeness of analysis
7. Check practical applicability
8. Verify clarity of reasoning',
       id
from template;
