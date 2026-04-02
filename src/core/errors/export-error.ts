type ExportErrorOptions = {
  cause?: unknown;
};

export class ExportError extends Error {
  readonly code = "EXPORT_ERROR" as const;

  constructor(message: string, options: ExportErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "ExportError";

    Object.setPrototypeOf(this, ExportError.prototype);
  }
}
