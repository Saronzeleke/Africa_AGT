"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In production, this would:
      // 1. Send email to backend API
      // 2. Backend sends password reset email
      // 3. Show success message

      setShowSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent password reset instructions to
            <br />
            <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Click the link in the email to reset your password.
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full">
        {/* Back Button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Logo */}
        <div className="mb-6">
          <Logo size="md" />
        </div>

        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-600 text-center mb-6">
          No worries! Enter your email and we'll send you reset instructions.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700 font-semibold">
              EMAIL ADDRESS
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@health.gov.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 bg-gray-100 border-0"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
