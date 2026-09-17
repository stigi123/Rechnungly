import { track } from "@vercel/analytics";
import { ANALYTICS_EVENTS } from "@/lib/config";

export function trackCreateClick() {
  track(ANALYTICS_EVENTS.createClick);
}

export function trackPdfDownload() {
  track(ANALYTICS_EVENTS.pdfDownload);
}

export function trackUnlockClick() {
  track(ANALYTICS_EVENTS.unlockClick);
}
