"use client"

import "./globals.css";
import "leaflet/dist/leaflet.css";
import AuthProvider from "@/context/AuthProvider";

import { Toaster } from "react-hot-toast";
import IssueContextProvider from "@/context/IssueContext";
import { SocketProvider } from "@/context/SocketProvider";
import Providers from "./provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <SocketProvider>
            <Providers>
              <IssueContextProvider>
                {children}
              </IssueContextProvider>
            </Providers>
          </SocketProvider>
          <Toaster position="top-right" reverseOrder={false} />
        </body>
      </AuthProvider>
    </html>
  );
}
