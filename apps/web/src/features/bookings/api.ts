import { api } from "@/lib/api-client";
import type { BookingDto, BookingInput } from "@elite-drive/types";

export const bookingsApi = {
  create: (body: BookingInput) => api.post<BookingDto>("/bookings", body),
  listMine: () => api.get<BookingDto[]>("/bookings"),
  listOwner: () => api.get<BookingDto[]>("/bookings/owner"),
  getById: (id: string) => api.get<BookingDto>(`/bookings/${id}`),
  approve: (id: string) => api.post<BookingDto>(`/bookings/${id}/approve`),
  reject: (id: string, reason?: string) =>
    api.post<BookingDto>(`/bookings/${id}/reject`, { reason }),
  cancel: (id: string, reason?: string) =>
    api.post<BookingDto>(`/bookings/${id}/cancel`, { reason }),
  start: (id: string) => api.post<BookingDto>(`/bookings/${id}/start`),
  complete: (id: string) => api.post<BookingDto>(`/bookings/${id}/complete`),
  markPaid: (id: string) => api.post<BookingDto>(`/bookings/${id}/mark-paid`),
};
