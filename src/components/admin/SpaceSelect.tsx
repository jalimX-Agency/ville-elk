"use client";

import { SPACE_OPTIONS } from "./gallery-categories";

/** Which part of the suite new photos go into; empty means "sort later". */
export function SpaceSelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      className="field-input h-11 w-auto py-0"
    >
      {SPACE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      <option value="">Non classée</option>
    </select>
  );
}
