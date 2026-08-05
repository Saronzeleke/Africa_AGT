"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { UserRole } from "@/types";
import { logger } from "@/lib/utils/logger";

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
    
    logger.log('🔐 LOGIN ATTEMPT:', { email, role });
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/auth/login`;
      logger.log('🌐 API URL:', apiUrl);
      
      // CRITICAL: Use real backend API call (not auth service)
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      logger.log('📡 API RESPONSE:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const error = await response.json();
        logger.error('❌ LOGIN API ERROR:', error);
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      logger.log('✅ LOGIN SUCCESS DATA:', {
        hasAccessToken: !!data.access_token,
        tokenLength: data.access_token?.length,
        dataKeys: Object.keys(data)
      });
      
      // CRITICAL: Check if we have access_token
      if (data.access_token) {
        // CRITICAL: Store token in localStorage AND cookie for persistence
        logger.log('💾 STORING TOKEN IN MULTIPLE LOCATIONS...');
        
        // Store in localStorage (for API calls)
        localStorage.setItem('afyametrix_token', data.access_token);
        
        // Store in cookie (for middleware)
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieFlags = isProduction 
          ? 'path=/; secure; samesite=strict; max-age=86400'
          : 'path=/; samesite=lax; max-age=86400'; // Changed to lax for localhost
        
        const cookieString = `afyametrix_token=${data.access_token}; ${cookieFlags}`;
        logger.log('🍪 SETTING COOKIE:', {
          isProduction,
          cookieFlags,
          tokenPreview: data.access_token.substring(0, 20) + '...'
        });
        
        document.cookie = cookieString;
        
        // Store user data if available
        if (data.user) {
          localStorage.setItem('afyametrix_user', JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          }));
        }
        
        // Verify storage worked
        const tokenStored = localStorage.getItem('afyametrix_token');
        const cookieSet = document.cookie.includes('afyametrix_token');
        logger.log('✅ STORAGE VERIFICATION:', {
          localStorageToken: !!tokenStored,
          cookieSet,
          tokenLength: tokenStored?.length
        });
        
        logger.log('🔄 REDIRECTING TO DASHBOARD...');
        // CRITICAL: Force redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        logger.error('❌ NO ACCESS TOKEN IN RESPONSE');
        throw new Error('No access token received');
      }
    } catch (error: any) {
      logger.error('💥 LOGIN FAILED:', error);
      setError(error.message || 'Invalid credentials. Please check your email and password.');
      setIsLoading(false);
    }
    // Don't set loading false on success - we're redirecting
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
