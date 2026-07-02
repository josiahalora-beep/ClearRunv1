const KEY_STORAGE = "clearrun_admin_key";
const TS_STORAGE = "clearrun_admin_key_ts";
const TTL_HOURS = Number(process.env.REACT_APP_ADMIN_SESSION_TTL_HOURS || 4);

/**
 * Reads the admin key from sessionStorage, honoring a soft client-side TTL so
 * operators are asked to re-enter the key periodically. Never persisted to
 * localStorage and never sent anywhere except the X-Admin-Key header.
 */
export function getAdminKey() {
  const key = sessionStorage.getItem(KEY_STORAGE);
  const ts = sessionStorage.getItem(TS_STORAGE);
  if (!key || !ts) return null;
  const ageHours = (Date.now() - Number(ts)) / (1000 * 60 * 60);
  if (ageHours > TTL_HOURS) {
    clearAdminKey();
    return null;
  }
  return key;
}

export function setAdminKey(key) {
  sessionStorage.setItem(KEY_STORAGE, key);
  sessionStorage.setItem(TS_STORAGE, String(Date.now()));
}

export function clearAdminKey() {
  sessionStorage.removeItem(KEY_STORAGE);
  sessionStorage.removeItem(TS_STORAGE);
}
