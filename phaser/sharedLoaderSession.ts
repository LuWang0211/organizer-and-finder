const SHARED_LOADER_SEEN_KEY = "phaser.sharedLoaderSeen";

export function hasSeenSharedLoader() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(SHARED_LOADER_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSharedLoaderSeen() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(SHARED_LOADER_SEEN_KEY, "1");
  } catch {
    // Ignore storage failures and keep the loader functional.
  }
}
