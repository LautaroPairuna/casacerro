"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AdminRate = {
  id: number;
  label: string;
  people: number;
  price: number;
};

type AdminRoomType = {
  id: number;
  code: string;
  name: string;
  badge: string;
  description: string;
  rates: AdminRate[];
};

type ApiResponse = {
  roomTypes: AdminRoomType[];
};

type UpdateRateResponse = {
  rate: AdminRate;
};

type ToastState = {
  id: number;
  type: "success" | "error";
  message: string;
} | null;

const TOAST_DURATION_MS = 3200;

function formatCurrency(value: number): string {
  return value.toLocaleString("es-AR");
}

export default function AdminTarifasPage() {
  const [roomTypes, setRoomTypes] = useState<AdminRoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRateId, setSavingRateId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ id: Date.now(), type, message });
  };

  const fetchData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/tarifas", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("No se pudieron cargar las tarifas.");
      }
      const payload = (await response.json()) as ApiResponse;
      setRoomTypes(payload.roomTypes);
    } catch {
      setLoadError("No se pudieron cargar las tarifas.");
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void fetchData(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => {
      setToast(null);
    }, TOAST_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const rowCount = useMemo(
    () => roomTypes.reduce((acc, roomType) => acc + roomType.rates.length, 0),
    [roomTypes]
  );

  const onChangePrice = (roomTypeId: number, rateId: number, value: string) => {
    const nextValue = Number(value);
    setRoomTypes((current) =>
      current.map((roomType) =>
        roomType.id === roomTypeId
          ? {
              ...roomType,
              rates: roomType.rates.map((rate) =>
                rate.id === rateId
                  ? {
                      ...rate,
                      price: Number.isFinite(nextValue) && nextValue >= 0 ? nextValue : rate.price,
                    }
                  : rate
              ),
            }
          : roomType
      )
    );
  };

  const saveRate = async (roomTypeId: number, rate: AdminRate) => {
    setSavingRateId(rate.id);
    setToast(null);
    try {
      const response = await fetch(`/api/admin/tarifas/${rate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomTypeId,
          price: rate.price,
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };
        throw new Error(body.message ?? "No se pudo guardar la tarifa.");
      }

      const payload = (await response.json()) as UpdateRateResponse;
      setRoomTypes((current) =>
        current.map((roomType) =>
          roomType.id === roomTypeId
            ? {
                ...roomType,
                rates: roomType.rates.map((item) =>
                  item.id === payload.rate.id ? { ...item, price: payload.rate.price } : item
                ),
              }
            : roomType
        )
      );

      showToast("success", `Tarifa "${rate.label}" actualizada.`);
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "No se pudo guardar la tarifa.";
      showToast("error", message);
    } finally {
      setSavingRateId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#dccdaf] bg-white/95 p-8 shadow-[0_8px_22px_rgba(71,41,10,0.06)]">
        <p className="text-sm uppercase tracking-[0.14em] text-[#a87b51]">Cargando tarifas...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-[#dccdaf] bg-white/95 p-6 shadow-[0_8px_24px_rgba(71,41,10,0.06)] md:p-8">
        <h2 className="text-4xl font-medium text-[#20160a] md:text-5xl">Tarifas</h2>
        <div className="mt-4 h-0.5 w-24 bg-[#fcb040]" />
        <p className="mt-4 max-w-2xl text-sm text-neutral-600 md:text-base">
          Editá los valores por tipo de habitación y cantidad de personas.
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#a87b51] md:text-sm">
          Total de filas configuradas: {rowCount}
        </p>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {loadError}
        </div>
      )}
      <div className="pointer-events-none fixed right-4 top-20 z-50 md:right-8">
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`relative overflow-hidden rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${
                toast.type === "success"
                  ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
                  : "border-red-200 bg-red-50/95 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <span>{toast.message}</span>
              </div>
              <motion.div
                key={`${toast.id}-progress`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: TOAST_DURATION_MS / 1000, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-0.5 w-full origin-left ${
                  toast.type === "success" ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {roomTypes.map((roomType) => (
        <article
          key={roomType.id}
          className="overflow-hidden rounded-3xl border border-[#dccdaf] bg-white shadow-[0_8px_22px_rgba(71,41,10,0.05)]"
        >
          <div className="border-b border-[#eadcc2] bg-[#f8f2e4] px-6 py-6 md:px-7">
            <h3 className="text-3xl text-[#22150a] md:text-4xl">{roomType.name}</h3>
            <p className="mt-2 max-w-3xl text-sm text-neutral-600 md:text-base">{roomType.description}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#6c1710] md:text-sm">
              {roomType.badge}
            </p>
          </div>

          <div className="overflow-x-auto px-5 py-4 md:px-6">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#eadcc2] text-[11px] uppercase tracking-[0.12em] text-[#9d7b58] md:text-xs">
                  <th className="px-3 py-3 font-semibold">Tipo</th>
                  <th className="px-3 py-3 font-semibold">Personas</th>
                  <th className="px-3 py-3 font-semibold">Precio (ARS)</th>
                  <th className="px-3 py-3 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {roomType.rates.map((rate) => (
                  <tr
                    key={rate.id}
                    className={`border-b border-[#f3ead9] last:border-b-0 ${
                      savingRateId === rate.id ? "bg-[#fffaf0]" : ""
                    }`}
                  >
                    <td className="px-3 py-4 text-base font-medium text-[#25170a]">{rate.label}</td>
                    <td className="px-3 py-4 text-base text-neutral-700">{rate.people}</td>
                    <td className="px-3 py-4">
                      <input
                        type="number"
                        min={1}
                        disabled={savingRateId === rate.id}
                        value={rate.price}
                        onChange={(event) =>
                          onChangePrice(roomType.id, rate.id, event.target.value)
                        }
                        className={`w-full rounded-xl border border-[#d9cdb6] bg-[#fffdf8] px-3 py-2.5 text-base outline-none ring-[#6c1710] transition focus:ring-2 ${
                          savingRateId === rate.id ? "cursor-not-allowed opacity-70" : ""
                        }`}
                      />
                      <p className="mt-1.5 text-xs text-neutral-500 md:text-sm">
                        Formateado: ${formatCurrency(rate.price)}
                      </p>
                    </td>
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        disabled={savingRateId === rate.id}
                        onClick={() => saveRate(roomType.id, rate)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#6c1710] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6c1710] transition hover:bg-[#6c1710] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {savingRateId === rate.id ? (
                          <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#6c1710] border-t-transparent" />
                            Guardando...
                          </>
                        ) : (
                          "Guardar"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      ))}
    </section>
  );
}
