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
        <p className="text-white/90 text-sm">
          Not a first timer?{" "}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200 font-semibold underline">
            Log In
          </Link>
          {" "}or{" "}
          <Link href="/signup" className="text-cyan-300 hover:text-cyan-200 font-semibold underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
