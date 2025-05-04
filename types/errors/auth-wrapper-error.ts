export class AuthWrapperError extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, AuthWrapperError.prototype);
  }
}
