import { api } from "@/lib/api-client";
import type {
  CarDto,
  CarListResponse,
  CarInput,
  CarUpdateInput,
  AvailabilityInput,
} from "@elite-drive/types";

export interface CarSearchParams {
  q?: string;
  category?: string;
  transmission?: string;
  fuel?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  from?: string;
  to?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

function toQuery(params: CarSearchParams): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== null) {
      sp.set(key, String(value));
    }
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const carsApi = {
  search: (params: CarSearchParams) =>
    api.get<CarListResponse>(`/cars${toQuery(params)}`),
  getById: (id: string) => api.get<CarDto>(`/cars/${id}`),
  listMine: () => api.get<CarDto[]>("/cars/mine"),
  create: (body: CarInput) => api.post<CarDto>("/cars", body),
  update: (id: string, body: CarUpdateInput) =>
    api.patch<CarDto>(`/cars/${id}`, body),
  remove: (id: string) => api.del<{ ok: true }>(`/cars/${id}`),
  uploadImages: (id: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    return api.upload<CarDto>(`/cars/${id}/images`, form);
  },
  deleteImage: (id: string, imageId: string) =>
    api.del<CarDto>(`/cars/${id}/images/${imageId}`),
  availability: (id: string) =>
    api.get<{ id: string; startDate: string; endDate: string }[]>(
      `/cars/${id}/availability`,
    ),
  addBlock: (id: string, body: AvailabilityInput) =>
    api.post(`/cars/${id}/availability`, body),
  removeBlock: (id: string, blockId: string) =>
    api.del(`/cars/${id}/availability/${blockId}`),
};
