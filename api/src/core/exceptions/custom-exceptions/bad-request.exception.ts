export class BadRequestException extends Error {
  constructor(
    message?: { description: string },
    private statusCode = 400,
  ) {
    super(message.description);
    this.statusCode = statusCode;
    this.name = 'BadRequestException';
  }

  public getMessage(): string {
    return this.message;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }
}
