export function safeStorage(): Storage | null {
  if (typeof localStorage === "undefined") return null;
  try {
    localStorage.getItem("__test__");
    return localStorage;
  } catch {
    return null;
  }
}
