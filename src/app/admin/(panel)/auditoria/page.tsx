"use client";

import { useEffect, useState } from "react";

type AuditLog = {
  id: number;
  actorEmail: string;
  action: string;
  entity: string;
  entityId: string | null;
  previousData: unknown;
  nextData: unknown;
  createdAt: string;
};

type AuditPayload = {
  precio?: number;
  price?: number;
  etiqueta?: string;
  label?: string;
  correo?: string;
  email?: string;
};

function parsePayload(data: unknown): AuditPayload {
  if (typeof data !== "object" || data === null) {
    return {};
  }
  return data as AuditPayload;
}

function getActionLabel(action: string): string {
  const normalized = action.toLowerCase();
  if (normalized === "actualizar" || normalized === "update") return "Actualización";
  if (normalized === "crear" || normalized === "create") return "Creación";
  if (normalized === "eliminar" || normalized === "delete") return "Eliminación";
  return "Cambio";
}

function getEntityLabel(entity: string): string {
  const normalized = entity.toLowerCase();
  if (normalized === "tarifa_habitacion" || normalized === "roomrate") {
    return "Tarifa de habitación";
  }
  if (normalized === "usuario_administrador" || normalized === "adminuser") {
    return "Usuario administrador";
  }
  return "Registro del sistema";
}

function formatPrice(value: number | undefined): string | null {
  if (typeof value !== "number") return null;
  return `$${value.toLocaleString("es-AR")}`;
}

function getSummary(log: AuditLog): string {
  const previousData = parsePayload(log.previousData);
  const nextData = parsePayload(log.nextData);
  const beforePrice = previousData.precio ?? previousData.price;
  const afterPrice = nextData.precio ?? nextData.price;
  const label = nextData.etiqueta ?? nextData.label ?? previousData.etiqueta ?? previousData.label;
  const previousEmail = previousData.correo ?? previousData.email;
  const nextEmail = nextData.correo ?? nextData.email;

  if (typeof beforePrice === "number" && typeof afterPrice === "number") {
    return `Se actualizó ${label ?? "una tarifa"} de ${formatPrice(beforePrice)} a ${formatPrice(afterPrice)}.`;
  }

  if (nextEmail) {
    return `Se creó el usuario administrador ${nextEmail}.`;
  }

  if (previousEmail && !nextEmail) {
    return `Se modificó el usuario administrador ${previousEmail}.`;
  }

  return "Se registró un cambio en el sistema.";
}

export default function AdminAuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/auditoria", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("No se pudo cargar la auditoría.");
        }

        const payload = (await response.json()) as { logs: AuditLog[] };
        setLogs(payload.logs);
      } catch {
        setError("No se pudo cargar la auditoría.");
      } finally {
        setLoading(false);
      }
    };

    void fetchLogs();
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-[#dccdaf] bg-white/95 p-6 shadow-[0_8px_24px_rgba(71,41,10,0.06)] md:p-8">
        <h2 className="text-4xl font-medium text-[#20160a] md:text-5xl">Auditoría</h2>
        <div className="mt-4 h-0.5 w-24 bg-[#fcb040]" />
        <p className="mt-4 text-sm text-neutral-600 md:text-base">
          Historial de cambios realizados en el sistema de administración.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-[#dccdaf] bg-white p-6 text-sm uppercase tracking-[0.14em] text-[#a87b51]">
          Cargando auditoría...
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <article
              key={log.id}
              className="rounded-2xl border border-[#dccdaf] bg-white/95 p-5 shadow-[0_8px_18px_rgba(71,41,10,0.04)] md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#6c1710]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6c1710]">
                    {getActionLabel(log.action)}
                  </span>
                  <span className="rounded-full bg-[#f5ecd7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8d6a46]">
                    {getEntityLabel(log.entity)}
                  </span>
                  {log.entityId ? (
                    <span className="text-xs text-neutral-500">#{log.entityId}</span>
                  ) : null}
                </div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#a87b51]">
                  {new Date(log.createdAt).toLocaleString("es-AR")}
                </p>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.1em] text-neutral-500">
                Actor: {log.actorEmail}
              </p>
              <div className="mt-4 rounded-xl border border-[#eadcc2] bg-[#fcf8ee] px-4 py-3">
                <p className="text-sm text-neutral-700">{getSummary(log)}</p>
              </div>
            </article>
          ))}
          {logs.length === 0 && (
            <div className="rounded-3xl border border-[#dccdaf] bg-white p-6 text-sm text-neutral-600">
              Aún no hay registros de auditoría.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
