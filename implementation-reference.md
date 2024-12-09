# 思维协议系统实现参考文档

## 1. 项目结构说明

### 1.1 源代码结构 (`src/`)
```
src/
├── components/         # 可复用组件
├── config/            # 配置文件
├── core/              # 核心业务逻辑
├── features/          # 功能模块
├── hooks/             # 自定义Hooks
├── infrastructure/    # 基础设施
├── lib/              # 第三方库封装
├── pages/            # 页面组件
├── services/         # 服务层
├── shared/           # 共享资源
├── test/             # 测试相关
├── types/            # 类型定义
└── utils/            # 工具函数
```

### 1.2 关键文件说明

#### 1.2.1 入口文件
- `main.tsx` - 应用入口，配置路由和全局状态
- `App.tsx` - 根组件，处理布局和路由配置
- `theme.ts` - 主题配置文件

#### 1.2.2 类型定义文件
- `types/protocol.ts` - 协议相关类型定义
```typescript
export interface Protocol {
  id: string;
  title: string;
  description: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  category_id?: string;
  author: Author;
  category?: Category;
  tags: Tag[];
  collaborators?: Collaborator[];
}
```

#### 1.2.3 服务层文件
- `services/supabase.ts` - Supabase服务封装
```typescript
export const templateService = {
  create,
  update,
  delete,
  getById,
  getList,
  // ...其他方法
};
```

## 2. 核心功能实现参考

### 2.1 协议编辑器实现
```typescript
// components/editor/ProtocolEditor.tsx
interface ProtocolEditorProps {
  protocol: Protocol;
  onChange: (content: string) => void;
  onSave: () => void;
}

const ProtocolEditor: React.FC<ProtocolEditorProps> = ({
  protocol,
  onChange,
  onSave,
}) => {
  // 实现编辑器逻辑
};
```

### 2.2 协作功能实现
```typescript
// features/collaboration/CollaborationManager.ts
class CollaborationManager {
  private socket: Socket;
  private documentId: string;

  constructor(documentId: string) {
    this.socket = io(SOCKET_URL);
    this.documentId = documentId;
    this.initializeConnection();
  }

  private initializeConnection() {
    // 实现协作连接逻辑
  }
}
```

### 2.3 模板系统实现
```typescript
// features/templates/TemplateManager.ts
interface TemplateManager {
  createTemplate(data: TemplateData): Promise<Template>;
  applyTemplate(templateId: string, targetId: string): Promise<void>;
  // 其他模板管理方法
}
```

## 3. 数据模型设计

### 3.1 协议数据模型
```sql
-- protocols 表
CREATE TABLE protocols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  status VARCHAR NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- protocol_versions 表
CREATE TABLE protocol_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  protocol_id UUID REFERENCES protocols(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES auth.users(id)
);
```

### 3.2 模板数据模型
```sql
-- templates 表
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 4. API接口设计

### 4.1 协议管理接口
```typescript
// services/api/protocols.ts
export interface ProtocolAPI {
  // 创建协议
  create: (data: CreateProtocolDTO) => Promise<Protocol>;
  
  // 更新协议
  update: (id: string, data: UpdateProtocolDTO) => Promise<Protocol>;
  
  // 获取协议详情
  getById: (id: string) => Promise<Protocol>;
  
  // 获取协议列表
  getList: (params: GetProtocolsParams) => Promise<ProtocolList>;
  
  // 删除协议
  delete: (id: string) => Promise<void>;
}
```

### 4.2 协作接口
```typescript
// services/api/collaboration.ts
export interface CollaborationAPI {
  // 加入协作会话
  joinSession: (sessionId: string) => Promise<void>;
  
  // 发送操作
  sendOperation: (operation: Operation) => Promise<void>;
  
  // 同步状态
  syncState: () => Promise<DocumentState>;
}
```

## 5. 状态管理设计

### 5.1 全局状态
```typescript
// stores/globalStore.ts
interface GlobalState {
  user: User | null;
  theme: Theme;
  notifications: Notification[];
}

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  theme: 'light',
  notifications: [],
  // 状态更新方法
}));
```

### 5.2 协议编辑状态
```typescript
// stores/protocolStore.ts
interface ProtocolState {
  currentProtocol: Protocol | null;
  isEditing: boolean;
  changes: Change[];
}

export const useProtocolStore = create<ProtocolState>((set) => ({
  currentProtocol: null,
  isEditing: false,
  changes: [],
  // 状态更新方法
}));
```

## 6. 测试规范

### 6.1 单元测试示例
```typescript
// __tests__/components/ProtocolEditor.test.tsx
describe('ProtocolEditor', () => {
  it('should render editor with initial content', () => {
    const protocol = mockProtocol();
    render(<ProtocolEditor protocol={protocol} />);
    expect(screen.getByText(protocol.title)).toBeInTheDocument();
  });

  it('should handle content changes', async () => {
    const onChange = vi.fn();
    render(<ProtocolEditor onChange={onChange} />);
    // 测试内容变更
  });
});
```

### 6.2 集成测试示例
```typescript
// __tests__/features/collaboration.test.ts
describe('Collaboration Feature', () => {
  it('should sync changes between multiple users', async () => {
    // 测试多用户协作场景
  });

  it('should handle conflict resolution', async () => {
    // 测试冲突解决
  });
});
```

## 7. 部署配置

### 7.1 环境配置
```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
}
```

### 7.2 构建配置
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 其他构建配置
  },
  // 其他配置项
});
```

## 8. 性能优化建议

### 8.1 代码分割
```typescript
// 使用React.lazy进行组件懒加载
const ProtocolEditor = React.lazy(() => import('./components/ProtocolEditor'));
const TemplateManager = React.lazy(() => import('./components/TemplateManager'));
```

### 8.2 缓存策略
```typescript
// services/cache.ts
export const cacheService = {
  // 实现缓存逻辑
  set: (key: string, value: any, ttl?: number) => {},
  get: (key: string) => {},
  clear: () => {},
};
```

## 9. 安全措施

### 9.1 认证授权
```typescript
// middleware/auth.ts
export const requireAuth = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // 实现认证逻辑
};
```

### 9.2 数据验证
```typescript
// utils/validation.ts
export const validateProtocol = (data: unknown): Protocol => {
  // 实现数据验证逻辑
};
```

## 10. 监控告警

### 10.1 性能监控
```typescript
// utils/monitoring.ts
export const performanceMonitor = {
  trackPageLoad: () => {},
  trackApiCall: (endpoint: string, duration: number) => {},
  trackError: (error: Error) => {},
};
```

### 10.2 错误处理
```typescript
// utils/errorHandler.ts
export const errorHandler = {
  handleApiError: (error: unknown) => {},
  handleRuntimeError: (error: Error) => {},
  reportError: (error: Error) => {},
};
```
