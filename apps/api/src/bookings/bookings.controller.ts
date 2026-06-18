import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  bookingInputSchema,
  bookingDecisionSchema,
  type BookingInput,
  type BookingDecisionInput,
} from "@elite-drive/types";
import { BookingsService } from "./bookings.service";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser, type AuthUser } from "../common/current-user.decorator";

@ApiTags("bookings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(bookingInputSchema)) body: BookingInput,
  ) {
    return this.bookings.create(user.id, body);
  }

  // Түрээслэгчийн захиалгууд
  @Get()
  mine(@CurrentUser() user: AuthUser) {
    return this.bookings.listAsRenter(user.id);
  }

  // Эзний хүлээн авсан захиалгууд
  @Get("owner")
  owner(@CurrentUser() user: AuthUser) {
    return this.bookings.listAsOwner(user.id);
  }

  @Get(":id")
  findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.bookings.findOne(id, user.id);
  }

  @Post(":id/approve")
  approve(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.bookings.approve(id, user.id);
  }

  @Post(":id/reject")
  reject(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(bookingDecisionSchema)) body: BookingDecisionInput,
  ) {
    return this.bookings.reject(id, user.id, body.reason || undefined);
  }

  @Post(":id/cancel")
  cancel(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(bookingDecisionSchema)) body: BookingDecisionInput,
  ) {
    return this.bookings.cancel(id, user.id, body.reason || undefined);
  }

  @Post(":id/start")
  start(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.bookings.start(id, user.id);
  }

  @Post(":id/complete")
  complete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.bookings.complete(id, user.id);
  }

  @Post(":id/mark-paid")
  markPaid(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.bookings.markPaid(id, user.id);
  }
}
