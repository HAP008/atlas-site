/**
 * Waitlist: server wrapper that reads the endpoint at build time and renders the form.
 * Depends on: lib/waitlist-endpoint.ts. A malformed endpoint fails the build there.
 */

import { WaitlistForm } from "@/components/waitlist-form";
import { getWaitlistEndpoint } from "@/lib/waitlist-endpoint";

export function Waitlist({ className }: { className?: string }) {
  return <WaitlistForm endpoint={getWaitlistEndpoint()} className={className} />;
}

export function isWaitlistConnected(): boolean {
  return getWaitlistEndpoint() !== null;
}
