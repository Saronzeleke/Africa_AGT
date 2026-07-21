"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { authService } from "@/lib/api/services/auth.service";
import { UserRole } from "@/types";

export default function LoginPage() {
  const [role, setRole] = useState<"CHW" | "CHL">("CHW");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Use the real auth service with updated interface
      await authService.login({
        email,
        password,
      });

      // Get redirect URL from query params or default to dashboard
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      
      router.push(redirectTo);
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            {/* Logo */}
            <div className="mb-6">
              <Logo size="md" />
            </div>

            {/* Welcome Text */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome</h1>
              <p className="text-sm text-gray-600">Log in to your health portal</p>
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
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-semibold">
                      EMAIL
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@health.gov.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 bg-gray-100 border-0"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-semibold">
                      PASSWORD
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 bg-gray-100 border-0"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-gray-600 hover:text-primary inline-block"
                  >
                    Forgot Password?
                  </Link>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>

                  <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary font-semibold hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="CHL">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="email-chl" className="text-gray-700 font-semibold">
                      EMAIL
                    </Label>
                    <Input
                      id="email-chl"
                      type="email"
                      placeholder="you@health.gov.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 bg-gray-100 border-0"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password-chl" className="text-gray-700 font-semibold">
                      PASSWORD
                    </Label>
                    <Input
                      id="password-chl"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 bg-gray-100 border-0"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-gray-600 hover:text-primary inline-block"
                  >
                    Forgot Password?
                  </Link>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>

                  <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary font-semibold hover:underline">
                      Sign Up
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
            Health Data Starts at the Community Level
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Empower frontline health workers with digital tools that make reporting faster,
            easier, and more reliable — even in remote areas.
          </p>
        </div>
      </div>
    </div>
  );
}
