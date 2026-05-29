"use client";

import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function AIRecommendationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
        <p className="text-sm text-gray-600">CHW - Health Worker</p>
      </div>

      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            AI-Powered Recommendations
          </h2>
          <p className="text-gray-600 max-w-md">
            Intelligent recommendations for resource allocation, intervention
            strategies, and outbreak response based on historical data and
            current trends.
          </p>
          <p className="text-sm text-gray-500 italic">Coming soon...</p>
        </div>
      </Card>
    </div>
  );
}
