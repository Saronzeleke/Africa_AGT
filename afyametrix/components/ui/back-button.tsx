"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

interface BackButtonProps {
  fallbackUrl?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function BackButton({ 
  fallbackUrl = "/dashboard", 
  variant = "ghost",
  size = "sm",
  className = "",
  children
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    try {
      // Check if there's browser history to go back to
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        // Fallback to specified URL if no history
        router.push(fallbackUrl);
      }
    } catch (error) {
      // Safety fallback - redirect to dashboard
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {children || "Back"}
    </Button>
  );
}