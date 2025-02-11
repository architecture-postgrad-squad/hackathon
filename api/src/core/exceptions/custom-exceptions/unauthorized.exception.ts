export class UnauthorizedException extends Error {
  constructor(
    message?: { description: string },
    private statusCode = 401,
  ) {
    super(message?.description || 'Unauthorized');
    this.statusCode = statusCode;
    this.name = 'UnauthorizedException';
  }

  public getMessage(): string {
    return this.message;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }
}
