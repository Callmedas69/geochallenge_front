"use client";

import { useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

interface CustomAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  balance?: string;
}

export function CustomAccountModal({
  isOpen,
  onClose,
  address,
  balance,
}: CustomAccountModalProps) {
  const { disconnect } = useDisconnect();

  if (!isOpen) return null;

  const displayName = "Account";
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 duration-200 bg-black/50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative p-6 mx-4 rounded-lg border duration-200 w-min-80 bg-slate-900 border-slate-800 animate-in zoom-in-95">
        {/* Header with Avatar and Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex justify-center items-center mb-3 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <span className="text-lg font-bold text-white">
              {address.slice(2, 4).toUpperCase()}
            </span>
          </div>

          <h2 className="mb-1 text-lg font-semibold text-white">
            {displayName}
          </h2>

          <p className="mb-2 font-mono text-sm text-gray-400">
            {truncatedAddress}
          </p>

          {balance && <p className="text-sm text-gray-400">{balance}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCopyAddress}
            variant="secondary"
            className="flex-1 text-sm text-white bg-slate-800 hover:bg-slate-700 border-slate-700"
          >
            Copy Address
          </Button>

          <Button
            onClick={handleDisconnect}
            variant="destructive"
            className="flex-1 text-sm bg-slate-800 hover:bg-red-600"
          >
            Disconnect
          </Button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
