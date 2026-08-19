"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const API_LOADING_EVENT = "rushabh:api-loading-change";
const API_FETCH_TRACKER = Symbol.for("rushabh.apiFetchTracker");

type ApiFetchState = {
  pending: number;
  originalFetch: typeof fetch;
};

type TrackedFetch = typeof fetch & {
  [API_FETCH_TRACKER]?: ApiFetchState;
};

function isApiRequest(input: RequestInfo | URL): boolean {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;

  if (url.startsWith("/api/")) return true;

  try {
    const parsed = new URL(url, window.location.origin);
    return (
      parsed.origin === window.location.origin &&
      parsed.pathname.startsWith("/api/")
    );
  } catch {
    return false;
  }
}

function notifyPendingChange(pending: number) {
  window.dispatchEvent(
    new CustomEvent<number>(API_LOADING_EVENT, { detail: pending }),
  );
}

function installApiFetchTracker(): ApiFetchState {
  const currentFetch = window.fetch as TrackedFetch;
  const existingState = currentFetch[API_FETCH_TRACKER];
  if (existingState) return existingState;

  const state: ApiFetchState = {
    pending: 0,
    originalFetch: currentFetch.bind(window),
  };

  const trackedFetch = (async (...args: Parameters<typeof fetch>) => {
    if (!isApiRequest(args[0])) {
      return state.originalFetch(...args);
    }

    state.pending += 1;
    notifyPendingChange(state.pending);

    try {
      return await state.originalFetch(...args);
    } finally {
      state.pending = Math.max(0, state.pending - 1);
      notifyPendingChange(state.pending);
    }
  }) as TrackedFetch;

  trackedFetch[API_FETCH_TRACKER] = state;
  window.fetch = trackedFetch;
  return state;
}

export function ApiLoadingPopup() {
  const [pendingCalls, setPendingCalls] = useState(0);

  useEffect(() => {
    const state = installApiFetchTracker();
    setPendingCalls(state.pending);

    const handlePendingChange = (event: Event) => {
      const nextPending = (event as CustomEvent<number>).detail;
      setPendingCalls(typeof nextPending === "number" ? nextPending : state.pending);
    };

    window.addEventListener(API_LOADING_EVENT, handlePendingChange);
    return () => {
      window.removeEventListener(API_LOADING_EVENT, handlePendingChange);
    };
  }, []);

  if (pendingCalls === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-maroon-dark/35 px-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex min-w-64 flex-col items-center gap-4 rounded-xl border border-gold/30 bg-ivory px-8 py-7 text-center shadow-2xl">
        <Loader2 className="h-8 w-8 animate-spin text-maroon" aria-hidden="true" />
        <div>
          <p className="font-serif text-xl text-maroon">Please wait</p>
          <p className="mt-1 text-sm text-foreground/60">
            Loading latest changes...
          </p>
        </div>
      </div>
    </div>
  );
}
