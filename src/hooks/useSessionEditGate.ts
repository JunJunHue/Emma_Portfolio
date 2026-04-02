import { useCallback, useState } from "react";
import { EDIT_PASSWORD_SHA256_HEX, SESSION_UNLOCK_KEY } from "../config/editMode";
import { sha256Hex } from "../lib/crypto";

function readUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function useSessionEditGate() {
  const [unlocked, setUnlocked] = useState(readUnlocked);

  const unlock = useCallback(async (password: string) => {
    const hex = await sha256Hex(password);
    if (hex !== EDIT_PASSWORD_SHA256_HEX) return false;
    try {
      sessionStorage.setItem(SESSION_UNLOCK_KEY, "1");
    } catch {
      /* ignore */
    }
    setUnlocked(true);
    return true;
  }, []);

  const lock = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    } catch {
      /* ignore */
    }
    setUnlocked(false);
  }, []);

  return { unlocked, unlock, lock };
}
