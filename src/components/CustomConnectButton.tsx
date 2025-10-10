"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { Theme } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CustomAccountModal } from "./CustomAccountModal";

export const obsidianTheme: Theme = {
  blurs: {
    modalOverlay: "blur(0px)",
  },
  colors: {
    accentColor: "#0f172a",
    accentColorForeground: "#ffffff",
    actionButtonBorder: "#0f172a",
    actionButtonBorderMobile: "#0f172a",
    actionButtonSecondaryBackground: "#0f172a",
    closeButton: "#ffffff",
    closeButtonBackground: "#0f172a",
    connectButtonBackground: "#0f172a",
    connectButtonBackgroundError: "#ef4444",
    connectButtonInnerBackground: "#0f172a",
    connectButtonText: "#ffffff",
    connectButtonTextError: "#ffffff",
    connectionIndicator: "#22c55e",
    downloadBottomCardBackground: "#0f172a",
    downloadTopCardBackground: "#0f172a",
    error: "#ef4444",
    generalBorder: "#0f172a",
    generalBorderDim: "#0f172a",
    menuItemBackground: "#0f172a",
    modalBackdrop: "rgba(0, 0, 0, 0.5)",
    modalBackground: "#0f172a",
    modalBorder: "#0f172a",
    modalText: "#ffffff",
    modalTextDim: "#ffffff",
    modalTextSecondary: "#ffffff",
    profileAction: "#0f172a",
    profileActionHover: "#1e293b",
    profileForeground: "#0f172a",
    selectedOptionBorder: "#ffffff",
    standby: "#0f172a",
  },
  fonts: {
    body: "system-ui, sans-serif",
  },
  radii: {
    actionButton: "0px",
    connectButton: "0px",
    menuButton: "0px",
    modal: "0px",
    modalMobile: "0px",
  },
  shadows: {
    connectButton: "none",
    dialog: "none",
    profileDetailsAction: "none",
    selectedOption: "none",
    selectedWallet: "none",
    walletLogo: "none",
  },
};

export function CustomConnectButton() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Add CSS for learn more link
  if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.textContent = `
      [data-rk] a {
        color: #ffffff !important;
      }
      [data-rk] [data-testid*="learn-more"] {
        color: #ffffff !important;
      }
    `;
    if (!document.head.querySelector("style[data-custom-link-styles]")) {
      style.setAttribute("data-custom-link-styles", "");
      document.head.appendChild(style);
    }
  }

  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          const displayName = account?.displayName;

          return (
            <>
              {account && (
                <CustomAccountModal
                  isOpen={isAccountModalOpen}
                  onClose={() => setIsAccountModalOpen(false)}
                  address={account.address}
                  balance={account.displayBalance}
                />
              )}
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button
                        onClick={openConnectModal}
                        className="!text-white cursor-pointer bg-slate-900 hover:bg-slate-800 text-sm sm:text-base min-h-[44px]"
                      >
                        Connect Wallet
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button
                        onClick={openChainModal}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-sm sm:text-base min-h-[44px]"
                      >
                        Wrong network
                      </Button>
                    );
                  }

                  return (
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                      <Button
                        onClick={openChainModal}
                        variant="secondary"
                        className="hidden sm:flex gap-2 items-center text-white cursor-pointer bg-slate-900 hover:bg-slate-800 text-sm sm:text-base min-h-[44px] w-auto"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              overflow: "hidden",
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 18, height: 18 }}
                              />
                            )}
                          </div>
                        )}
                        <span className="truncate">{chain.name}</span>
                      </Button>

                      <Button
                        onClick={() => setIsAccountModalOpen(true)}
                        variant="secondary"
                        className="flex gap-2 items-center text-white cursor-pointer bg-slate-900 hover:bg-slate-800 text-sm sm:text-base min-h-[44px] w-full sm:w-auto"
                      >
                        <span className="truncate max-w-[120px] sm:max-w-none">
                          {displayName}
                        </span>
                        {account.displayBalance && (
                          <span className="hidden text-xs opacity-75 sm:text-sm xs:inline">
                            ({account.displayBalance})
                          </span>
                        )}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            </>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
}
