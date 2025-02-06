export class InternalServerErrorException extends Error {
  constructor(
    message?: { description: string },
    private statusCode = 500,
  ) {
    super(message.description);
    this.statusCode = statusCode;
    this.name = 'InternalServerErrorException';
  }

  public getMessage(): string {
    return this.message;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }
}
