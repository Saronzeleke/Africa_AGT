"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { authService } from "@/lib/api/services/auth.service";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (verificationCode.length < 4) {
      setErrorMessage("Please enter the verification code");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    // Call backend API using auth service
    try {
      await authService.verifyEmail({
        email: email,
        code: verificationCode,
      });
      
      setVerificationStatus("success");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationStatus("error");
      setErrorMessage(error.message || "Invalid verification code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      // Call backend API to resend verification email  
      const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) {
        setResendCooldown(60);
        alert("Verification code resent! Check your email.");
      } else {
        const errorData = await response.json();
        alert(`Failed to resend code: ${errorData.detail || 'Please try again later.'}`);
      }
    } catch (error) {
      console.error('Resend error:', error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been successfully verified.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Logo size="md" />
        </div>

        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          We've sent a verification code to your email
          <br />
          <strong>{email}</strong>
        </p>

        {/* Verification Code Input */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setVerificationCode(value);
              setErrorMessage("");
              setVerificationStatus("pending");
            }}
            className="text-center text-2xl tracking-widest font-bold"
            maxLength={10}
          />
          {errorMessage && (
            <p className="text-xs text-red-600 mt-2 flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3" />
              {errorMessage}
            </p>
          )}
          <p className="text-xs text-gray-500 text-center mt-2">
            Check your email for the verification code
          </p>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          className="w-full mb-4"
          size="lg"
          disabled={isVerifying || verificationCode.length < 4}
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <Button
            variant="link"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-primary"
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend Code"}
          </Button>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="text-gray-600"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
