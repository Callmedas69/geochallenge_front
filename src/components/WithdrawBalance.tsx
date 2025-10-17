/**
 * @title WithdrawBalance Component
 * @notice Withdraw accumulated balance to user wallet
 * @dev KISS principle: Simple balance display and withdraw button
 */

"use client";

import { useWithdrawBalance } from "@/hooks/useUserActions";
import { useClaimableBalance } from "@/hooks/usePublicCompetitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { CheckCircle, Loader2, DollarSign, Wallet } from "lucide-react";

export function WithdrawBalance() {
  const { address } = useAccount();
  const { data: balance } = useClaimableBalance(address);
  const { withdrawBalance, isPending, isConfirming, isSuccess, error } =
    useWithdrawBalance();

  const handleWithdraw = async () => {
    try {
      await withdrawBalance();
    } catch (err) {
      console.error("Failed to withdraw balance:", err);
    }
  };

  // Not connected
  if (!address) {
    return (
      <Card className="border-l-4 border-l-gray-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">
            Withdraw Balance
          </CardTitle>
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-400">-- ETH</div>
          <p className="text-xs text-muted-foreground mt-1">Connect wallet</p>
        </CardContent>
      </Card>
    );
  }

  // No balance
  if (!balance || balance === BigInt(0)) {
    return (
      <Card className="border-l-4 border-l-gray-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">
            Withdraw Balance
          </CardTitle>
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-400">0.0000 ETH</div>
          <p className="text-xs text-muted-foreground mt-1">
            No balance available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="border-l-4 border-l-green-500 bg-green-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-green-800">
            Withdraw Balance
          </CardTitle>
          <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-700" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700">
            {formatEther(balance)} ETH
          </div>
          <p className="text-xs text-green-800 font-semibold mt-1">
            ✅ Withdrawn successfully!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Withdraw Balance</CardTitle>
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <Wallet className="h-6 w-6 text-green-600" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Balance Display */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            Available Balance
          </p>
          <p className="text-3xl font-bold text-green-600">
            {formatEther(balance)} ETH
          </p>
        </div>

        {/* Withdraw Button */}
        <Button
          onClick={handleWithdraw}
          disabled={isPending || isConfirming}
          className="w-full bg-green-600 hover:bg-green-700"
          size="sm"
        >
          {isPending && (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Approving...
            </>
          )}
          {isConfirming && (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Confirming...
            </>
          )}
          {!isPending && !isConfirming && (
            <>
              <Wallet className="mr-2 h-3 w-3" />
              Withdraw
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-xs">
              {error.message.includes("Insufficient balance")
                ? "Insufficient balance"
                : "Failed to withdraw"}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
