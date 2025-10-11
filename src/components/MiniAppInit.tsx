"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Initializes Farcaster Mini App SDK
 * Calls ready() to hide loading splash and display app
 */
export function MiniAppInit() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return null;
}
