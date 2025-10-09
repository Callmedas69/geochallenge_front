/**
 * @title ConfirmInputDialog Component
 * @notice Enhanced confirmation dialog requiring text input
 * @dev KISS principle - for ultra-destructive actions like Cancel/Finalize
 */

"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface ConfirmInputDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmText: string; // Text user must type to confirm
  actionLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  disabled?: boolean;
}

export function ConfirmInputDialog({
  trigger,
  title,
  description,
  confirmText,
  actionLabel = "Continue",
  variant = "default",
  onConfirm,
  disabled = false,
}: ConfirmInputDialogProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const isValid = input === confirmText;

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
      setOpen(false);
      setInput(""); // Reset input
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setInput(""); // Reset input when closed
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild disabled={disabled}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="confirm-input">
            Type <span className="font-bold">{confirmText}</span> to confirm
          </Label>
          <Input
            id="confirm-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={confirmText}
            className={input && !isValid ? "border-destructive" : ""}
          />
          {input && !isValid && (
            <p className="text-sm text-destructive">
              Text must match exactly: {confirmText}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isValid}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                : "disabled:opacity-50"
            }
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
