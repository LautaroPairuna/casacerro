"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

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
  tariffInfo: TariffInfo | null;
};

type UpdateRateResponse = {
  rate: AdminRate;
};

type TariffInfo = {
  parkingNote: string;
  seasonalNote: string;
  validityNote: string;
  extraNotes: string[];
};

type UpdateTariffInfoResponse = {
  tariffInfo: TariffInfo;
};

type ToastState = {
  id: number;
  type: "success" | "error";
  message: string;
} | null;

type NewRateDraft = {
  label: string;
  people: string;
  price: string;
};

const EMPTY_DRAFT: NewRateDraft = { label: "", people: "2", price: "" };

const INPUT_CLASS =
  "w-full rounded-xl border border-[#d9cdb6] bg-[#fffdf8] px-3 py-2.5 text-base outline-none ring-[#6c1710] transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70";
const ICON_BUTTON_CLASS =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d9cdb6] text-[#6c1710] transition hover:bg-[#6c1710] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#6c1710]";

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? fallback;
  } catch {
    return fallback;
  }
}

const TOAST_DURATION_MS = 3200;
const INITIAL_TARIFF_INFO: TariffInfo = {
  parkingNote: "",
  seasonalNote: "",
  validityNote: "",
  extraNotes: [],
};

function formatCurrency(value: number): string {
  return value.toLocaleString("es-AR");
}

export default function AdminTarifasPage() {
  const [roomTypes, setRoomTypes] = useState<AdminRoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRateId, setSavingRateId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [tariffInfo, setTariffInfo] = useState<TariffInfo>(INITIAL_TARIFF_INFO);
  const [savingTariffInfo, setSavingTariffInfo] = useState(false);
  // Fila (o tipo de habitación, para el alta) con una operación en curso.
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<number, NewRateDraft>>({});

  // Contador para que cada toast tenga id propio (reinicia la animación).
  const toastSeq = useRef(0);
  const showToast = (type: "success" | "error", message: string) => {
    toastSeq.current += 1;
    setToast({ id: toastSeq.current, type, message });
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
      if (payload.tariffInfo) {
        setTariffInfo(payload.tariffInfo);
      }
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

  const onChangeRate = (
    roomTypeId: number,
    rateId: number,
    field: "label" | "people" | "price",
    value: string
  ) => {
    setRoomTypes((current) =>
      current.map((roomType) =>
        roomType.id === roomTypeId
          ? {
              ...roomType,
              rates: roomType.rates.map((rate) => {
                if (rate.id !== rateId) return rate;
                if (field === "label") return { ...rate, label: value };
                const nextValue = Number(value);
                return Number.isFinite(nextValue) && nextValue >= 0
                  ? { ...rate, [field]: nextValue }
                  : rate;
              }),
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
          label: rate.label,
          people: rate.people,
        }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "No se pudo guardar la tarifa."));
      }

      const payload = (await response.json()) as UpdateRateResponse;
      setRoomTypes((current) =>
        current.map((roomType) =>
          roomType.id === roomTypeId
            ? {
                ...roomType,
                rates: roomType.rates.map((item) =>
                  item.id === payload.rate.id ? { ...item, ...payload.rate } : item
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

  const moveRate = async (rate: AdminRate, direction: "up" | "down") => {
    setBusyKey(`rate-${rate.id}`);
    try {
      const response = await fetch(`/api/admin/tarifas/${rate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
      if (!response.ok) {
        throw new Error(await readError(response, "No se pudo cambiar el orden."));
      }
      await fetchData();
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "No se pudo cambiar el orden.");
    } finally {
      setBusyKey(null);
    }
  };

  const deleteRate = async (rate: AdminRate) => {
    if (!window.confirm(`¿Eliminar la tarifa "${rate.label}"? Deja de mostrarse en la web.`)) {
      return;
    }
    setBusyKey(`rate-${rate.id}`);
    try {
      const response = await fetch(`/api/admin/tarifas/${rate.id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(await readError(response, "No se pudo eliminar la tarifa."));
      }
      await fetchData();
      showToast("success", `Tarifa "${rate.label}" eliminada.`);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "No se pudo eliminar la tarifa.");
    } finally {
      setBusyKey(null);
    }
  };

  const draftFor = (roomTypeId: number) => drafts[roomTypeId] ?? EMPTY_DRAFT;

  const onChangeDraft = (roomTypeId: number, field: keyof NewRateDraft, value: string) => {
    setDrafts((current) => ({
      ...current,
      [roomTypeId]: { ...(current[roomTypeId] ?? EMPTY_DRAFT), [field]: value },
    }));
  };

  const createRate = async (roomTypeId: number) => {
    const draft = draftFor(roomTypeId);
    setBusyKey(`new-${roomTypeId}`);
    try {
      const response = await fetch("/api/admin/tarifas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomTypeId,
          label: draft.label,
          people: Number(draft.people),
          price: Number(draft.price),
        }),
      });
      if (!response.ok) {
        throw new Error(await readError(response, "No se pudo agregar la tarifa."));
      }
      await fetchData();
      setDrafts((current) => ({ ...current, [roomTypeId]: EMPTY_DRAFT }));
      showToast("success", `Tarifa "${draft.label.trim()}" agregada.`);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "No se pudo agregar la tarifa.");
    } finally {
      setBusyKey(null);
    }
  };

  const onChangeTariffInfo = (field: keyof TariffInfo, value: string) => {
    setTariffInfo((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const onAddExtraNote = () => {
    setTariffInfo((current) => ({
      ...current,
      extraNotes: [...current.extraNotes, ""],
    }));
  };

  const onChangeExtraNote = (index: number, value: string) => {
    setTariffInfo((current) => ({
      ...current,
      extraNotes: current.extraNotes.map((note, noteIndex) =>
        noteIndex === index ? value : note
      ),
    }));
  };

  const onRemoveExtraNote = (index: number) => {
    setTariffInfo((current) => ({
      ...current,
      extraNotes: current.extraNotes.filter((_, noteIndex) => noteIndex !== index),
    }));
  };

  const saveTariffInfo = async () => {
    setSavingTariffInfo(true);
    setToast(null);
    try {
      const response = await fetch("/api/admin/tarifas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tariffInfo),
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };
        throw new Error(body.message ?? "No se pudo guardar la información general.");
      }

      const payload = (await response.json()) as UpdateTariffInfoResponse;
      setTariffInfo(payload.tariffInfo);
      showToast("success", "Información general de tarifas actualizada.");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la información general.";
      showToast("error", message);
    } finally {
      setSavingTariffInfo(false);
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
          Editá, agregá, ordená o eliminá las tarifas de cada tipo de habitación. Los
          cambios se ven en la web apenas se guardan.
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

      <article className="overflow-hidden rounded-3xl border border-[#dccdaf] bg-white shadow-[0_8px_22px_rgba(71,41,10,0.05)]">
        <div className="border-b border-[#eadcc2] bg-[#f8f2e4] px-6 py-6 md:px-7">
          <h3 className="text-2xl text-[#22150a] md:text-3xl">Información del bloque inferior</h3>
          <p className="mt-2 max-w-3xl text-sm text-neutral-600 md:text-base">
            Este contenido se muestra al público debajo de las tarjetas de tarifas.
          </p>
        </div>
        <div className="space-y-4 px-5 py-5 md:px-6">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9d7b58]">
              Nota de cochera
            </span>
            <textarea
              rows={2}
              value={tariffInfo.parkingNote}
              onChange={(event) => onChangeTariffInfo("parkingNote", event.target.value)}
              className="w-full rounded-xl border border-[#d9cdb6] bg-[#fffdf8] px-3 py-2.5 text-sm outline-none ring-[#6c1710] transition focus:ring-2"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9d7b58]">
              Nota de temporada
            </span>
            <textarea
              rows={2}
              value={tariffInfo.seasonalNote}
              onChange={(event) => onChangeTariffInfo("seasonalNote", event.target.value)}
              className="w-full rounded-xl border border-[#d9cdb6] bg-[#fffdf8] px-3 py-2.5 text-sm outline-none ring-[#6c1710] transition focus:ring-2"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9d7b58]">
              Nota de vigencia
            </span>
            <textarea
              rows={2}
              value={tariffInfo.validityNote}
              onChange={(event) => onChangeTariffInfo("validityNote", event.target.value)}
              className="w-full rounded-xl border border-[#d9cdb6] bg-[#fffdf8] px-3 py-2.5 text-sm outline-none ring-[#6c1710] transition focus:ring-2"
            />
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9d7b58]">
                Notas adicionales
              </span>
              <button
                type="button"
                onClick={onAddExtraNote}
                disabled={savingTariffInfo || tariffInfo.extraNotes.length >= 8}
                className="rounded-full border border-[#6c1710] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6c1710] transition hover:bg-[#6c1710] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                Agregar nota
              </button>
            </div>
            {tariffInfo.extraNotes.map((note, index) => (
              <div key={`extra-note-${index}`} className="flex items-start gap-2">
                <textarea
                  rows={2}
                  value={note}
                  onChange={(event) => onChangeExtraNote(index, event.target.value)}
                  className="w-full rounded-xl border border-[#d9cdb6] bg-[#fffdf8] px-3 py-2.5 text-sm outline-none ring-[#6c1710] transition focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => onRemoveExtraNote(index)}
                  disabled={savingTariffInfo}
                  className="mt-1 rounded-full border border-red-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
          <div className="pt-1">
            <button
              type="button"
              onClick={saveTariffInfo}
              disabled={savingTariffInfo}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#6c1710] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6c1710] transition hover:bg-[#6c1710] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingTariffInfo ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#6c1710] border-t-transparent" />
                  Guardando...
                </>
              ) : (
                "Guardar bloque"
              )}
            </button>
          </div>
        </div>
      </article>
      <div className="pointer-events-none fixed right-4 top-20 z-50 md:right-8">
        {toast && (
          <div
            key={toast.id}
            className={`cc-anim-toast-in relative overflow-hidden rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${
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
            <div
              key={`${toast.id}-progress`}
              className={`cc-anim-progress absolute bottom-0 left-0 h-0.5 w-full ${
                toast.type === "success" ? "bg-emerald-400" : "bg-red-400"
              }`}
              style={{ ["--anim-duration" as string]: `${TOAST_DURATION_MS / 1000}s` }}
            />
          </div>
        )}
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
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#eadcc2] text-[11px] uppercase tracking-[0.12em] text-[#9d7b58] md:text-xs">
                  <th className="w-24 px-3 py-3 font-semibold">Orden</th>
                  <th className="px-3 py-3 font-semibold">Tipo</th>
                  <th className="w-28 px-3 py-3 font-semibold">Personas</th>
                  <th className="w-56 px-3 py-3 font-semibold">Precio (ARS)</th>
                  <th className="w-48 px-3 py-3 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {roomType.rates.map((rate, index) => {
                  const saving = savingRateId === rate.id;
                  const busy = saving || busyKey === `rate-${rate.id}`;
                  return (
                    <tr
                      key={rate.id}
                      className={`border-b border-[#f3ead9] align-top last:border-b-0 ${
                        busy ? "bg-[#fffaf0]" : ""
                      }`}
                    >
                      <td className="px-3 py-4">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            aria-label={`Subir "${rate.label}"`}
                            title="Subir"
                            disabled={busy || index === 0}
                            onClick={() => moveRate(rate, "up")}
                            className={ICON_BUTTON_CLASS}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Bajar "${rate.label}"`}
                            title="Bajar"
                            disabled={busy || index === roomType.rates.length - 1}
                            onClick={() => moveRate(rate, "down")}
                            className={ICON_BUTTON_CLASS}
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <input
                          type="text"
                          aria-label="Nombre de la tarifa"
                          maxLength={100}
                          disabled={busy}
                          value={rate.label}
                          onChange={(event) =>
                            onChangeRate(roomType.id, rate.id, "label", event.target.value)
                          }
                          className={`${INPUT_CLASS} font-medium text-[#25170a]`}
                        />
                      </td>
                      <td className="px-3 py-4">
                        <input
                          type="number"
                          aria-label="Cantidad de personas"
                          min={1}
                          max={10}
                          disabled={busy}
                          value={rate.people}
                          onChange={(event) =>
                            onChangeRate(roomType.id, rate.id, "people", event.target.value)
                          }
                          className={INPUT_CLASS}
                        />
                      </td>
                      <td className="px-3 py-4">
                        <input
                          type="number"
                          aria-label="Precio por noche"
                          min={1}
                          disabled={busy}
                          value={rate.price}
                          onChange={(event) =>
                            onChangeRate(roomType.id, rate.id, "price", event.target.value)
                          }
                          className={INPUT_CLASS}
                        />
                        <p className="mt-1.5 text-xs text-neutral-500 md:text-sm">
                          Formateado: ${formatCurrency(rate.price)}
                        </p>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => saveRate(roomType.id, rate)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#6c1710] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#6c1710] transition hover:bg-[#6c1710] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {saving ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#6c1710] border-t-transparent" />
                                Guardando...
                              </>
                            ) : (
                              "Guardar"
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label={`Eliminar "${rate.label}"`}
                            title="Eliminar"
                            disabled={busy}
                            onClick={() => deleteRate(rate)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-300 text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Alta de una tarifa nueva: se agrega al final; después se puede
              mover con las flechas. */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void createRate(roomType.id);
            }}
            className="border-t border-[#eadcc2] bg-[#fdf9f0] px-5 py-5 md:px-6"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#9d7b58]">
              Agregar tarifa en {roomType.name}
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_7rem_12rem_auto] md:items-end">
              <label className="block space-y-1.5">
                <span className="text-xs text-neutral-600">Nombre (ej.: Doble Superior)</span>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  disabled={busyKey === `new-${roomType.id}`}
                  value={draftFor(roomType.id).label}
                  onChange={(event) => onChangeDraft(roomType.id, "label", event.target.value)}
                  className={INPUT_CLASS}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-neutral-600">Personas</span>
                <input
                  type="number"
                  required
                  min={1}
                  max={10}
                  disabled={busyKey === `new-${roomType.id}`}
                  value={draftFor(roomType.id).people}
                  onChange={(event) => onChangeDraft(roomType.id, "people", event.target.value)}
                  className={INPUT_CLASS}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-neutral-600">Precio por noche</span>
                <input
                  type="number"
                  required
                  min={1}
                  disabled={busyKey === `new-${roomType.id}`}
                  value={draftFor(roomType.id).price}
                  onChange={(event) => onChangeDraft(roomType.id, "price", event.target.value)}
                  className={INPUT_CLASS}
                />
              </label>
              <button
                type="submit"
                disabled={busyKey === `new-${roomType.id}`}
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-full bg-[#6c1710] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#53110b] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Plus size={16} />
                Agregar
              </button>
            </div>
          </form>
        </article>
      ))}
    </section>
  );
}
