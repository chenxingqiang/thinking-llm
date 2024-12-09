import { Protocol } from '../../types/protocol';
import { Comment } from '../../types/comment';

interface ExportOptions {
  includeMetadata?: boolean;
  includeComments?: boolean;
  includeHistory?: boolean;
}

interface ProtocolComment extends Comment {
  author: {
    name: string;
  };
}

interface ExportProtocol extends Protocol {
  comments?: ProtocolComment[];
}

export function generateMarkdown(protocol: ExportProtocol, options: ExportOptions = {}): string {
  let content = `# ${protocol.title}\n\n`;

  // Add metadata if requested
  if (options.includeMetadata) {
    content += `## Metadata\n`;
    content += `- Author: ${protocol.author?.name ?? 'Unknown'}\n`;
    content += `- Created: ${new Date(protocol.created_at).toLocaleDateString()}\n`;
    content += `- Updated: ${new Date(protocol.updated_at).toLocaleDateString()}\n`;
    content += `- Category: ${protocol.category?.name ?? 'Uncategorized'}\n`;
    content += `- Tags: ${protocol.tags?.length ? protocol.tags.map(t => t.name).join(', ') : 'None'}\n\n`;
  }

  // Add main content
  content += `## Content\n\n${protocol.content}\n\n`;

  // Add comments if requested
  if (options.includeComments && protocol.comments?.length) {
    content += `## Comments\n\n`;
    protocol.comments.forEach(comment => {
      content += `### ${comment.author?.name ?? 'Anonymous'} (${new Date(comment.created_at).toLocaleDateString()})\n`;
      content += `${comment.content}\n\n`;
    });
  }

  return content;
}

export async function generateHTML(protocol: ExportProtocol, options: ExportOptions = {}): Promise<string> {
  const content = generateMarkdown(protocol, options);
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${protocol.title}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          .metadata { background: #f5f5f5; padding: 15px; border-radius: 5px; }
          .content { margin: 20px 0; }
          .comments { border-top: 1px solid #eee; margin-top: 20px; }
        </style>
      </head>
      <body>
        ${content.replace(/\n/g, '<br>')}
      </body>
    </html>
  `;
}

export async function generatePDF(protocol: Protocol, options: ExportOptions = {}): Promise<Blob> {
  const html = await generateHTML(protocol, options);
  
  // Basic PDF generation using html2pdf or similar library
  try {
    // This is a placeholder until we implement actual PDF generation
    const encoder = new TextEncoder();
    const pdfData = encoder.encode(html); // Convert HTML to bytes for now
    return new Blob([pdfData], { type: 'application/pdf' });
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('PDF generation is not fully implemented yet');
  }
}

export async function generateDOCX(protocol: Protocol, options: ExportOptions = {}): Promise<Blob> {
  try {
    // Build content sections
    const contentSections = [
      protocol.title,
      protocol.description,
      protocol.content
    ];

    // Add metadata section if requested
    if (options.includeMetadata) {
      const metadataSection = [
        `Author: ${protocol.author.name}`,
        `Created: ${protocol.created_at}`,
        `Updated: ${protocol.updated_at}`
      ].join('\n');
      
      contentSections.unshift(metadataSection);
    }

    // Join all sections
    const finalContent = contentSections.join('\n\n');

    // This is a placeholder until we implement actual DOCX generation
    const encoder = new TextEncoder();
    const docxData = encoder.encode(finalContent);
    return new Blob([docxData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  } catch (error) {
    console.error('DOCX generation failed:', error);
    throw new Error('DOCX generation is not fully implemented yet');
  }
} 