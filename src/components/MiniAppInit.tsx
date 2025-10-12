"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Initializes Farcaster Mini App SDK
 * Calls ready() to hide loading splash and display app
 */
export function MiniAppInit() {
  useEffect(() => {
    const initSDK = async () => {
      try {
        // Call ready to signal app is loaded
        await sdk.actions.ready();
        console.log("✅ Farcaster SDK: Ready call successful");
      } catch (error) {
        // This is expected when testing outside Farcaster
        console.warn("⚠️ Farcaster SDK: Not running in miniApp context", error);
      }
    };

    initSDK();
  }, []);

  return null;
}
