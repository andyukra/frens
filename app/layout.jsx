"use client";

import "./globals.css";
import Provider from "./Provider";
import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["300", "600"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function(OneSignal) {
      await OneSignal.init({
        appId: "d0433dfd-d5ce-4147-9402-9c17119fcc55",
      });
    });

    return () => {
      window.OneSignal = undefined;
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Frens</title>
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
      </head>
      <body style={quicksand.style}>
        <Provider>
          <header className="sticky top-0 z-[61] mb-5">
            <Navbar />
          </header>
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
