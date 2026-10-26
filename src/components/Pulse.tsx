"use client";

import { useEffect } from "react";
import { startPulse } from "@/lib/track";

/** Mounts the first-party visit log once per page load. Renders nothing. */
export function Pulse() {
  useEffect(() => startPulse(), []);
  return null;
}
