export class InvalidDescriptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDescriptionError";
  }
}
