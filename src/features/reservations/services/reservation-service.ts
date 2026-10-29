import { http } from "@/features/common/http";
import type { Page } from "@/features/common/domain/pagination";
import type { Reservation, ReservationInput } from "../domain/reservation";

export const reservationService = {
  create(input: ReservationInput) {
    return http<{ data: Reservation }>("reservations", { method: "POST", body: JSON.stringify(input) });
  },
  mine(page = 1, limit = 10) {
    return http<Page<Reservation>>(`reservations/mias?page=${page}&limit=${limit}`);
  },
  all(page = 1, limit = 10) {
    return http<Page<Reservation>>(`reservations?page=${page}&limit=${limit}`);
  }
};
