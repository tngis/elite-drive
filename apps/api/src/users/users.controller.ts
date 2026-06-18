import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@elite-drive/types";
import { UsersService } from "./users.service";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser, type AuthUser } from "../common/current-user.decorator";
import { carImageMulterOptions } from "../cars/upload.config";
import { StorageService } from "../storage/storage.service";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly users: UsersService,
    private readonly storage: StorageService,
  ) {}

  @Patch("me")
  updateMe(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(updateProfileSchema)) body: UpdateProfileInput,
  ) {
    return this.users.updateProfile(user.id, body);
  }

  @Post("me/avatar")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file", carImageMulterOptions))
  async uploadAvatar(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException("Зураг сонгоно уу");
    const url = await this.storage.save(file);
    return this.users.setAvatar(user.id, url);
  }
}
