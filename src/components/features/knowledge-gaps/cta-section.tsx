"use client";

import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 to-orange-600 py-12 px-6 md:py-16 md:px-10">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]" />
      
      <div className="relative max-w-3xl mx-auto text-center space-y-6 text-white">
        <h2 className="text-3xl font-bold">Ready to optimize your learning?</h2>
        <p className="text-amber-100 text-lg">
          Unlock powerful insights into your knowledge and transform how you prepare for exams.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button size="lg" variant="secondary">
            <BarChart className="mr-2 h-4 w-4" />
            Start Analytics
          </Button>
          <Button size="lg" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
            View Demo
          </Button>
        </div>
      </div>
    </section>
  );
}