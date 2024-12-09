import './components/ProtocolConfigurator';

// Define the custom event type
interface ThinkingSubmittedEvent extends CustomEvent {
  detail: {
    content: string;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app')!;
  
  app.innerHTML = `
    <div class="container">
      <h1>Thinking Protocol Configuration</h1>
      <protocol-configurator></protocol-configurator>
      <thinking-editor></thinking-editor>
    </div>
  `;

  // Fix the event listener with proper type casting
  document.querySelector('thinking-editor')?.addEventListener('thinking-submitted', ((e: ThinkingSubmittedEvent) => {
    console.log('Thinking submitted:', e.detail.content);
  }) as EventListener);
}); 