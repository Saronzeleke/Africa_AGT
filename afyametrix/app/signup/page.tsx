"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const [role, setRole] = useState<"CHW" | "CHL">("CHW");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-+]/g, ""))) {
      newErrors.phone = "Invalid phone number (10-15 digits)";
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location/PHC is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In production, this would:
      // 1. Send data to backend API
      // 2. Backend creates user account
      // 3. Backend sends verification email
      // 4. Show success message

      setShowSuccess(true);
      setIsSubmitting(false);

      // Redirect to verification page after 3 seconds
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }, 3000);
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created!
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification email to <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to verification page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-cyan-50 to-blue-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            {/* Logo */}
            <div className="mb-6">
              <Logo size="md" />
            </div>

            {/* Welcome Text */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
              <p className="text-sm text-gray-600">Join the health surveillance platform</p>
            </div>

            {/* Role Tabs */}
            <Tabs
              defaultValue="CHW"
              className="mb-6"
              onValueChange={(value) => setRole(value as "CHW" | "CHL")}
            >
              <TabsList className="w-full">
                <TabsTrigger value="CHW" className="flex-1">
                  <div className="text-center">
                    <div className="font-semibold">CHW</div>
                    <div className="text-xs">Health Worker</div>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="CHL" className="flex-1">
                  <div className="text-center">
                    <div className="font-semibold">CHL</div>
                    <div className="text-xs">Health Leader</div>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="CHW">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700 font-semibold">
                      FULL NAME <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Amara Uche"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.fullName ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-semibold">
                      EMAIL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@health.gov.ng"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.email ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-semibold">
                      PHONE NUMBER <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.phone ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="text-gray-700 font-semibold">
                      LOCATION/PHC <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="PHC-001"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.location ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.location && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-semibold">
                      PASSWORD <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.password ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.password && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">
                      CONFIRM PASSWORD <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.confirmPassword ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-semibold hover:underline">
                      Log In
                    </Link>
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="CHL">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Same form fields for CHL */}
                  <div>
                    <Label htmlFor="fullName-chl" className="text-gray-700 font-semibold">
                      FULL NAME <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName-chl"
                      type="text"
                      placeholder="Daniel U."
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.fullName ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email-chl" className="text-gray-700 font-semibold">
                      EMAIL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email-chl"
                      type="email"
                      placeholder="you@health.gov.ng"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.email ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone-chl" className="text-gray-700 font-semibold">
                      PHONE NUMBER <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone-chl"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.phone ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location-chl" className="text-gray-700 font-semibold">
                      LOCATION/DISTRICT <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location-chl"
                      type="text"
                      placeholder="Port Harcourt District"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.location ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.location && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password-chl" className="text-gray-700 font-semibold">
                      PASSWORD <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password-chl"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.password ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.password && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword-chl" className="text-gray-700 font-semibold">
                      CONFIRM PASSWORD <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword-chl"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className={`mt-2 bg-gray-100 border-0 ${
                        errors.confirmPassword ? "ring-2 ring-red-500" : ""
                      }`}
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-semibold hover:underline">
                      Log In
                    </Link>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Join the Health Surveillance Network
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Be part of a platform that empowers health workers to report, track, and
            respond to disease outbreaks in real-time — even from the most remote areas.
          </p>
        </div>
      </div>
    </div>
  );
}
