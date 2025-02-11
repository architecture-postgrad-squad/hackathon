export class NotFoundException extends Error {
  constructor(
    message?: { description: string },
    private statusCode = 404,
  ) {
    super(message.description);
    this.statusCode = statusCode;
    this.name = 'NotFoundException';
  }

  public getMessage(): string {
    return this.message;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }
}
