import {
  createDefaultInvoice,
  type Invoice,
} from "@/lib/invoice";
import { PRICING } from "@/lib/config";

const DRAFT_KEY = "rechnungly.draft.v1";
const UNLOCK_KEY = "rechnungly.unlock.v1";

type UnlockRecord = {
  until: number;
};

export type UnlockSnapshot = {
  days: number;
  unlocked: boolean;
};

const listeners = new Set<() => void>();
let storeVersion = 0;
let memoryDraft: Invoice | null = null;
let memoryUnlock: UnlockSnapshot | null = null;

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function emit() {
  storeVersion += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeStorage(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getStoreVersion(): number {
  return storeVersion;
}

export function loadDraft(): Invoice {
  if (memoryDraft) return memoryDraft;
  if (!canUseStorage()) return createDefaultInvoice();
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      memoryDraft = createDefaultInvoice();
      return memoryDraft;
    }
    const parsed = JSON.parse(raw) as Invoice;
    if (!parsed || typeof parsed !== "object") return createDefaultInvoice();
    const fallback = createDefaultInvoice();
    memoryDraft = {
      ...fallback,
      ...parsed,
      sender: { ...fallback.sender, ...parsed.sender },
      client: { ...fallback.client, ...parsed.client },
      items:
        Array.isArray(parsed.items) && parsed.items.length > 0
          ? parsed.items
          : fallback.items,
    };
    return memoryDraft;
  } catch {
    return createDefaultInvoice();
  }
}

export function saveDraft(invoice: Invoice): void {
  memoryDraft = invoice;
  if (canUseStorage()) {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(invoice));
    } catch {
      // Private mode / quota should not block editing.
    }
  }
  emit();
}

export function readUnlock(): UnlockSnapshot {
  if (memoryUnlock) return memoryUnlock;
  if (!canUseStorage()) return { days: 0, unlocked: false };
  try {
    const raw = window.localStorage.getItem(UNLOCK_KEY);
    if (!raw) return { days: 0, unlocked: false };
    const parsed = JSON.parse(raw) as UnlockRecord;
    const until = parsed?.until;
    if (!until || typeof until !== "number") return { days: 0, unlocked: false };
    const now = Date.now();
    const unlocked = until > now;
    memoryUnlock = {
      unlocked,
      days: unlocked ? Math.max(0, Math.ceil((until - now) / (24 * 60 * 60 * 1000))) : 0,
    };
    return memoryUnlock;
  } catch {
    return { days: 0, unlocked: false };
  }
}

export function activateUnlock(now = Date.now()): number {
  const until = now + PRICING.unlockDays * 24 * 60 * 60 * 1000;
  memoryUnlock = {
    unlocked: true,
    days: PRICING.unlockDays,
  };
  if (canUseStorage()) {
    try {
      window.localStorage.setItem(UNLOCK_KEY, JSON.stringify({ until } satisfies UnlockRecord));
    } catch {
      // Session unlock still applies via memoryUnlock.
    }
  }
  emit();
  return until;
}
