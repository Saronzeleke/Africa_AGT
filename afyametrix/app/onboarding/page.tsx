"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const onboardingSteps = [
  {
    title: "Health Data, Simplified",
    description:
      "AfyaMetrix digitizes community health reporting — from the last mile to the decision table. No complexity, just clarity.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070",
  },
  {
    title: "Live Outbreak Detection",
    description:
      "Smart anomaly detection flags potential outbreaks within 24 hours. Health leaders get instant alerts with severity levels and heatmaps.",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2032",
  },
  {
    title: "Two Roles, One Platform",
    description:
      "Separate portals for Community Health Workers and Health Leaders — each optimized for their specific tasks and access levels.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070",
  },
  {
    title: "Works Without Internet",
    description:
      "Fully offline-first. Report data from remote areas and sync automatically when connectivity is restored. No data loss, ever.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2070",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/login");
    }
  };

  const handleSkip = () => {
    router.push("/login");
  };

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Illustration */}
        <div className="w-full max-w-2xl mb-12">
          <div 
            className="w-full h-64 bg-cover bg-center rounded-2xl shadow-lg"
            style={{ backgroundImage: `url('${step.image}')` }}
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          {step.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center max-w-xl mb-12 leading-relaxed">
          {step.description}
        </p>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-12">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-secondary"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 w-full max-w-md">
          {!isLastStep && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {isLastStep ? "Log In" : "Next"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
