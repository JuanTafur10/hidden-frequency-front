"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Page } from "@/features/common/domain/pagination";
import { HttpError } from "@/features/common/http";
import type { Reservation } from "../domain/reservation";
import { reservationService } from "../services/reservation-service";

interface ReservationsState { key: string; result?: Page<Reservation>; error?: string }

export function useReservations(scope: "mine" | "all") {
  const params = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<ReservationsState>({ key: "" });
  const query = `${scope}:${page}:${revision}`;

  useEffect(() => {
    let active = true;
    const load = scope === "mine" ? reservationService.mine(page) : reservationService.all(page);
    load.then((result) => { if (active) setState({ key: query, result }); })
      .catch((error: unknown) => {
        if (active) setState({ key: query, error: error instanceof HttpError ? error.message : "No se pudieron cargar las reservas." });
      });
    return () => { active = false; };
  }, [page, query, scope]);

  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  return { page, result: state.key === query ? state.result : undefined, error: state.key === query ? state.error : undefined, loading: state.key !== query, refresh };
}
