import {Inter} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}