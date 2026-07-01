import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <section className="container-page py-28 flex flex-col items-center text-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900/5 text-navy-900"><Compass className="h-6 w-6" /></span>
        <h1 className="font-display text-3xl font-bold text-navy-950">Page not found</h1>
        <p className="text-slate-500 max-w-md">The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" data-testid="notfound-home-link">
          <Button className="mt-2">Back to Home</Button>
        </Link>
      </section>
    </Layout>
  );
}
