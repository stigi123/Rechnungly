"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { createDefaultInvoice, type Invoice } from "@/lib/invoice";
import {
  getStoreVersion,
  loadDraft,
  readUnlock,
  saveDraft,
  subscribeStorage,
  type UnlockSnapshot,
} from "@/lib/storage";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function useStoreVersion() {
  return useSyncExternalStore(subscribeStorage, getStoreVersion, () => 0);
}

export function useInvoiceDraft() {
  useStoreVersion();
  const isClient = useIsClient();
  const [local, setLocal] = useState<Invoice | null>(null);
  const invoice = local ?? (isClient ? loadDraft() : createDefaultInvoice());

  const setInvoice = useCallback((update: Invoice | ((current: Invoice) => Invoice)) => {
    setLocal((prev) => {
      const current = prev ?? loadDraft();
      const next = typeof update === "function" ? update(current) : update;
      saveDraft(next);
      return next;
    });
  }, []);

  return [invoice, setInvoice] as const;
}

export function useUnlockState(): UnlockSnapshot {
  useStoreVersion();
  const isClient = useIsClient();
  return isClient ? readUnlock() : { days: 0, unlocked: false };
}
