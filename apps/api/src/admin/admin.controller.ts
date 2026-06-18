import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AdminGuard } from "../common/admin.guard";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("stats")
  stats() {
    return this.admin.stats();
  }

  @Get("users")
  users() {
    return this.admin.listUsers();
  }

  @Post("users/:id/block")
  block(@Param("id") id: string) {
    return this.admin.setBlocked(id, true);
  }

  @Post("users/:id/unblock")
  unblock(@Param("id") id: string) {
    return this.admin.setBlocked(id, false);
  }

  @Get("cars")
  cars() {
    return this.admin.listCars();
  }

  @Post("cars/:id/deactivate")
  deactivate(@Param("id") id: string) {
    return this.admin.setCarActive(id, false);
  }

  @Post("cars/:id/activate")
  activate(@Param("id") id: string) {
    return this.admin.setCarActive(id, true);
  }

  @Get("bookings")
  bookings() {
    return this.admin.listBookings();
  }
}
