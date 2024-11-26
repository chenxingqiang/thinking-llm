-- Seed protocol tags
insert into protocol_tags (name) values
    ('beginner'),
    ('advanced'),
    ('automated'),
    ('manual'),
    ('quick'),
    ('detailed'),
    ('validated'),
    ('experimental'),
    ('standard'),
    ('optimization');

-- Seed protocol categories
insert into protocol_categories (name, description) values
    ('Analysis', 'Protocols for analyzing complex problems'),
    ('Design', 'Protocols for design thinking and creative solutions'),
    ('Decision Making', 'Protocols for making better decisions'),
    ('Innovation', 'Protocols for generating innovative ideas'),
    ('Learning', 'Protocols for effective learning and knowledge retention'),
    ('Problem Solving', 'Protocols for solving various types of problems'),
    ('Research', 'Protocols for conducting research'),
    ('Strategy', 'Protocols for strategic planning and execution'),
    ('Team Collaboration', 'Protocols for effective team collaboration'),
    ('Personal Development', 'Protocols for personal growth and development');

-- Seed templates
insert into templates (title, content) values
    (
        'Basic Protocol Template',
        '# Protocol Title

## Purpose
Describe the purpose of this protocol.

## Prerequisites
- List any prerequisites
- Required materials
- Required knowledge

## Steps
1. First step
2. Second step
3. Third step

## Expected Outcomes
Describe what should be achieved.

## Notes
Any additional notes or considerations.'
    ),
    (
        'Detailed Analysis Template',
        '# Analysis Protocol

## Overview
Brief overview of the analysis process.

## Data Requirements
- Data type 1
- Data type 2

## Analysis Steps
1. Data preparation
2. Initial analysis
3. In-depth analysis
4. Validation

## Results Documentation
- Key findings
- Recommendations
- Next steps

## Quality Checks
- Validation points
- Error checks'
    ),
    (
        'Decision Making Template',
        '# Decision Protocol

## Context
Describe the decision context.

## Stakeholders
- List stakeholders
- Their interests

## Criteria
1. Criterion 1
2. Criterion 2

## Options
- Option 1
- Option 2

## Analysis
Analysis method description.

## Decision
How to make the final decision.'
    );

-- Insert some example protocols
insert into protocols (title, description, content, status) values
    (
        'Problem Analysis Framework',
        'A systematic approach to analyzing and breaking down complex problems',
        '# Problem Analysis Framework

## Purpose
To provide a structured approach for analyzing complex problems and identifying root causes.

## Steps
1. Problem Definition
2. Impact Assessment
3. Root Cause Analysis
4. Solution Generation
5. Implementation Planning',
        'active'
    ),
    (
        'Design Thinking Process',
        'A human-centered approach to innovation and problem-solving',
        '# Design Thinking Process

## Overview
A methodology for creative problem solving

## Phases
1. Empathize
2. Define
3. Ideate
4. Prototype
5. Test',
        'active'
    ),
    (
        'Decision Matrix Analysis',
        'A quantitative method for evaluating and prioritizing options',
        '# Decision Matrix Analysis

## Purpose
To evaluate multiple options against important criteria

## Process
1. List Options
2. Define Criteria
3. Weight Criteria
4. Score Options
5. Calculate Results',
        'active'
    );

-- Create a default admin user profile (assuming admin user exists)
insert into user_profiles (id, display_name, bio)
select 
    id,
    'System Admin',
    'System administrator account'
from auth.users
where email = 'admin@example.com'
on conflict (id) do nothing;