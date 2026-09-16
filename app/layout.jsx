import "./globals.css";
import Provider from "./Provider";
import { Quicksand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
//COMPONENTS
import OneSignalInit from "@/components/OneSignalInit";
import ImageViewer from "@/components/ImageViewer";

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
          <ImageViewer />
          {children}
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}