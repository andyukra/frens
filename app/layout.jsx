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
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.init({
        appId: "736e3c17-35ed-4cf9-a2b7-bd58f727c849",
        safari_web_id: "web.onesignal.auto.62a04992-e924-4258-8064-560c4d6dc347",
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
        <script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          async=""
        ></script>
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
