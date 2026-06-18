import { api } from "@/lib/api-client";

export interface AdminStats {
  users: number;
  cars: number;
  bookings: number;
  activeBookings: number;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  isAdmin: boolean;
  isBlocked: boolean;
  createdAt: string;
  carsCount: number;
  bookingsCount: number;
}

export interface AdminCar {
  id: string;
  brand: string;
  name: string;
  year: number;
  plateNumber: string;
  pricePerDay: number;
  location: string;
  isActive: boolean;
  imageUrl: string | null;
  owner: { id: string; name: string };
  createdAt: string;
}

export interface AdminBooking {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  total: number;
  paymentStatus: string;
  car: string;
  renter: string;
  owner: string;
  createdAt: string;
}

export const adminApi = {
  stats: () => api.get<AdminStats>("/admin/stats"),
  users: () => api.get<AdminUser[]>("/admin/users"),
  block: (id: string) => api.post<AdminUser>(`/admin/users/${id}/block`),
  unblock: (id: string) => api.post<AdminUser>(`/admin/users/${id}/unblock`),
  cars: () => api.get<AdminCar[]>("/admin/cars"),
  deactivate: (id: string) => api.post(`/admin/cars/${id}/deactivate`),
  activate: (id: string) => api.post(`/admin/cars/${id}/activate`),
  bookings: () => api.get<AdminBooking[]>("/admin/bookings"),
};
