import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
