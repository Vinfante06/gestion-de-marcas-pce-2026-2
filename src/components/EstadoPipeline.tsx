"use client";

import { ESTADOS } from "@/lib/constants";

interface Props {
  value: string | null;
  onChange: (value: string) => void;
}
export default function EstadoPipeline({ value, onChange }: Props) {
  const selected = ESTADOS.find((e) => e.value === value);

  return (
    <div className="pipeline">
      <div className="pipeline-track">
        {ESTADOS.map((estado) => (
          <div
            key={estado.value}
            className={`pipeline-step${value === estado.value ? " active" : ""}`}
            style={{ background: estado.color }}
            onClick={() => onChange(estado.value)}
          >
            {estado.label}
          </div>
        ))}
      </div>
      <div className="pipeline-caption">
        Estado seleccionado:{" "}
        <strong>{selected ? selected.label : "ninguno — toca una etapa"}</strong>
      </div>
    </div>
  );
}
