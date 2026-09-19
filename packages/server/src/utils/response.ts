export const HTTP = {
   OK: 200,
   CREATED: 201,
   BAD_REQUEST: 400,
   UNAUTHORIZED: 401,
   FORBIDDEN: 403,
   NOT_FOUND: 404,
   INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HTTP)[keyof typeof HTTP];

export class ApiResponse<T> {
   public statusCode: number;
   public data: T | null;
   public message: string;
   public success: boolean;

   constructor(statusCode: number, data: T | null = null, message = 'Success') {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
      this.success = statusCode < 400;
   }
}

export class ApiError extends Error {
   public statusCode: number;
   public data: unknown;
   public success: boolean;

   constructor(statusCode: number, message = 'Something went wrong', data: unknown = null) {
      super(message);

      this.statusCode = statusCode;
      this.data = data;
      this.success = false;

      Error.captureStackTrace(this, this.constructor);
   }
}
