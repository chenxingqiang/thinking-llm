import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Json } from '../lib/database.types';
import { generateMarkdown } from '../utils/exportGenerators';
import type { Protocol } from '../types/protocol';

type ExportFormat = 'markdown' | 'pdf' | 'html' | 'docx';

interface ExportOptions {
  includeMetadata?: boolean;
  includeComments?: boolean;
  includeHistory?: boolean;
}

export const useProtocolExport = (protocolId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportProtocol = async (format: ExportFormat, options: ExportOptions = {}) => {
    try {
      setLoading(true);

      // 获取协议内容
      const { data: protocol, error: protocolError } = await supabase
        .from('protocols')
        .select(`
          *,
          author:user_profiles(*),
          comments(*)
        `)
        .eq('id', protocolId)
        .single();

      if (protocolError) throw protocolError;

      // 根据格式生成导出内容
      let exportContent = '';
      switch (format) {
        case 'markdown':
          // 使用 as unknown 先转换为 unknown，再转换为 Protocol
          exportContent = generateMarkdown(protocol as unknown as Protocol, options);
          break;
        case 'pdf':
        case 'html':
        case 'docx':
          throw new Error(`Export to ${format} format is not implemented yet`);
      }

      // 创建并下载文件
      const blob = new Blob([exportContent], { type: getMimeType(format) });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protocol-${protocol.title}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 记录导出历史
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // 将 ExportOptions 转换为 Json 类型
      const jsonOptions: Json = {
        includeMetadata: options.includeMetadata || false,
        includeComments: options.includeComments || false,
        includeHistory: options.includeHistory || false
      };

      await supabase
        .from('protocol_exports_history')
        .insert([
          {
            protocol_id: protocolId,
            user_id: user.id,
            format,
            options: jsonOptions
          },
        ]);

    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const getMimeType = (format: ExportFormat): string => {
    switch (format) {
      case 'markdown':
        return 'text/markdown';
      case 'pdf':
        return 'application/pdf';
      case 'html':
        return 'text/html';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'text/plain';
    }
  };

  return {
    exportProtocol,
    loading,
    error,
  };
}; 