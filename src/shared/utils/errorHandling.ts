export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): string => {
  if (error instanceof AppError) {
    console.error(`${error.code}: ${error.message}`);
    return error.message;
  }
  if (error instanceof Error) {
    console.error('Application error:', error.message);
    return error.message;
  }
  const errorMessage = 'An unknown error occurred';
  console.error('Unknown error:', error);
  return errorMessage;
}; 