import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-cyan-900/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
          <Logo size="lg" />
        </div>

        {/* Tagline */}
        <h1 className="text-2xl md:text-3xl font-semibold text-white text-center mb-12 max-w-2xl">
          Last-Mile Health Surveillance Platform
        </h1>

        {/* CTA Button */}
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary-dark text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 mb-6"
        >
          <Link href="/onboarding" className="flex items-center gap-2">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>

        {/* Login Link */}
        <div className="text-white/90 text-sm text-center">
          <p className="mb-2">Not a first timer?</p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-cyan-300 hover:text-white border border-cyan-300 hover:bg-cyan-600 rounded-lg font-semibold transition-all duration-200 hover:border-cyan-500"
              prefetch={true}
            >
              Log In
            </Link>
            <span className="text-white/60">or</span>
            <Link 
              href="/signup" 
              className="px-4 py-2 text-cyan-300 hover:text-white border border-cyan-300 hover:bg-cyan-600 rounded-lg font-semibold transition-all duration-200 hover:border-cyan-500"
              prefetch={true}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
