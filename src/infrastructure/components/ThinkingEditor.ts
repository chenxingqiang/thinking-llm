export class ThinkingEditor extends HTMLElement {
  private textarea!: HTMLTextAreaElement;
  private submitButton!: HTMLButtonElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.initialize();
  }

  private initialize() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 1rem;
        }
        textarea {
          width: 100%;
          min-height: 200px;
          padding: 1rem;
          font-family: monospace;
        }
        button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <textarea placeholder="Enter your thinking process..."></textarea>
      <button>Submit</button>
    `;

    this.textarea = this.shadowRoot!.querySelector('textarea')!;
    this.submitButton = this.shadowRoot!.querySelector('button')!;
    
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.submitButton.addEventListener('click', () => {
      const event = new CustomEvent('thinking-submitted', {
        detail: { content: this.textarea.value },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    });
  }
}

customElements.define('thinking-editor', ThinkingEditor); 