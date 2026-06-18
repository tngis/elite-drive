import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import {
  carInputSchema,
  carUpdateSchema,
  carSearchSchema,
  availabilityInputSchema,
  type CarInput,
  type CarUpdateInput,
  type CarSearchInput,
  type AvailabilityInput,
} from "@elite-drive/types";
import { CarsService } from "./cars.service";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { Public } from "../common/public.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser, type AuthUser } from "../common/current-user.decorator";
import { carImageMulterOptions } from "./upload.config";
import { StorageService } from "../storage/storage.service";

@ApiTags("cars")
@Controller("cars")
export class CarsController {
  constructor(
    private readonly cars: CarsService,
    private readonly storage: StorageService,
  ) {}

  // ---- public ----
  @Public()
  @Get()
  search(
    @Query(new ZodValidationPipe(carSearchSchema)) query: CarSearchInput,
  ) {
    return this.cars.search(query);
  }

  // ---- owner: миний машинууд (тодорхой route эхэнд) ----
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("mine")
  listMine(@CurrentUser() user: AuthUser) {
    return this.cars.listMine(user.id);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cars.findOne(id);
  }

  @Public()
  @Get(":id/availability")
  availability(@Param("id") id: string) {
    return this.cars.listAvailability(id);
  }

  // ---- owner CRUD ----
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(carInputSchema)) body: CarInput,
  ) {
    return this.cars.create(user.id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(carUpdateSchema)) body: CarUpdateInput,
  ) {
    return this.cars.update(user.id, id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.cars.remove(user.id, id);
  }

  // ---- images ----
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseGuards(JwtAuthGuard)
  @Post(":id/images")
  @UseInterceptors(FilesInterceptor("files", 10, carImageMulterOptions))
  async uploadImages(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files?.length) throw new BadRequestException("Зураг сонгоно уу");
    const urls = await Promise.all(files.map((f) => this.storage.save(f)));
    return this.cars.addImages(user.id, id, urls);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id/images/:imageId")
  removeImage(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Param("imageId") imageId: string,
  ) {
    return this.cars.removeImage(user.id, id, imageId);
  }

  // ---- availability ----
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":id/availability")
  addBlock(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(availabilityInputSchema)) body: AvailabilityInput,
  ) {
    return this.cars.addAvailabilityBlock(user.id, id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id/availability/:blockId")
  removeBlock(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Param("blockId") blockId: string,
  ) {
    return this.cars.removeAvailabilityBlock(user.id, id, blockId);
  }
}
