import { BadRequestException, PipeTransform } from "@nestjs/common";
import type { ZodSchema } from "zod";

// Shared zod schema-г NestJS pipe болгож ашиглах (types package-тай нэг эх сурвалж)
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const first = result.error.issues[0];
      throw new BadRequestException(
        first ? first.message : "Буруу өгөгдөл",
      );
    }
    return result.data;
  }
}
