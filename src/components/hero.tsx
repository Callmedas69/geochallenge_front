"use client";

import localFont from "next/font/local";

const fontLondrina = localFont({
  src: "../assets/LondrinaSolid-Black.ttf",
});

export function Hero() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        {/* Headline */}
        <h1
          className={`text-4xl md:text-6xl font-bold mb-4 ${fontLondrina.className}`}
        >
          Common Doesn't Mean Easy ⌐◨-◨
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Easy? Think again. Commons aren't for quitters.
        </p>

        {/* CTA Line - Inline Style */}
        <p className="text-lg md:text-xl text-gray-600 font-medium italic">
          Start the Common Hunt · Prove Your Grind · Complete the Set · Enter
          the Challenge
        </p>
      </div>
    </section>
  );
}
