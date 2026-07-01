import { useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * Shared submit logic for all lead-capture forms (Try Free, Proof Mockup, Pilot, Partners).
 * Keeps each form component focused on its own fields while sharing request/status handling.
 */
export function useLeadSubmit(leadType, sourcePage) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const submit = async (fields) => {
    setStatus("loading");
    try {
      await axios.post(`${API}/leads`, { ...fields, lead_type: leadType, source_page: sourcePage });
      setStatus("success");
      return true;
    } catch (err) {
      setStatus("error");
      return false;
    }
  };

  return { status, submit };
}
