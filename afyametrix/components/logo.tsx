import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          <path
            d="M8 28L16 12L24 28"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 12L28 28"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 20L32 20"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]}`}>
          <span className="text-primary">Afya</span>
          <span className="text-secondary">Metrix</span>
        </span>
      )}
    </div>
  );
}
