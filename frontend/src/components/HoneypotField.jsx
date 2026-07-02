import React from "react";

/**
 * Invisible bot-trap field shared by all public lead forms. Real visitors never
 * see or fill it; if it arrives non-empty, the backend silently drops the lead.
 */
export function HoneypotField({ value, onChange }) {
  return (
    <input
      type="text"
      name="hp_website"
      value={value}
      onChange={onChange}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      data-testid="hp-website-field"
      style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", opacity: 0 }}
    />
  );
}
