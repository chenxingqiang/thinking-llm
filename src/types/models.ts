import type { Protocol, Activity } from './protocol'

export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Template extends BaseModel {
  title: string;
  description: string;
  content: string;
  category: string;
  status: 'active' | 'archived';
  user_id: string | null;
}

export interface ThinkingModel extends BaseModel {
  name: string;
  description: string;
  api_key_required: boolean;
  api_base_url: string | null;
  api_key: string | null;
  template_id: string;
}

export interface ThinkingStep extends BaseModel {
  name: string;
  description: string;
  content: string;
  order_index: number;
  template_id: string;
  model_id: string | null;
}

export interface ThinkingGuideline extends BaseModel {
  title: string;
  description: string;
  content: string;
  template_id: string;
}

export interface ThinkingFramework extends BaseModel {
  name: string;
  description: string;
  content: string;
  template_id: string;
}

export type { Protocol, Activity }
