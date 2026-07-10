export const ROUTE_QUEUE_CHANGE_EVENT = "clearrun-route-queue-change";

export function announceRouteQueueChange(detail = {}) {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") return;
  window.dispatchEvent(new CustomEvent(ROUTE_QUEUE_CHANGE_EVENT, { detail }));
}
