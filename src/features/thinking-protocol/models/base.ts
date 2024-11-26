export interface BaseModel {
    generate_response(prompt: string): Promise<string>;
    setup_credentials(credentials: Record<string, any>): void;
    
    // Add additional core methods
    validate_input(input: string): boolean;
    preprocess_prompt(prompt: string): string;
    postprocess_response(response: string): string;
} 