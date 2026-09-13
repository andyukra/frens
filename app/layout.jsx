import "./globals.css";
import Provider from "./Provider";
import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import OneSignalInit from "@/components/OneSignalInit";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components


const quicksand = Quicksand({ subsets: ["latin"], weight: ["300", "600"] });

export const metadata = {
  title: "Frens",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={quicksand.style}>
        <OneSignalInit />
        <Provider>
          <header className="sticky top-0 z-[61] mb-5">
            <Navbar />
          </header>
          {children}
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}