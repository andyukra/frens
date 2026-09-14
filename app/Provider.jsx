"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function Provider({ children }) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <header className="sticky top-0 z-[61] mb-5">
          <Navbar />
        </header>
      </Suspense>

      {children}
    </SessionProvider>
  );
}