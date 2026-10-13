import Link from "next/link";
import { Shield, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full glass-strong p-8 rounded-2xl border border-border/50">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-4xl font-extrabold mb-2 font-mono text-gradient">404</h1>
        <h2 className="text-xl font-bold mb-3">Page Not Found</h2>
        
        <p className="text-sm text-muted-foreground mb-8">
          The requested page could not be located on TruthScan AI.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all text-sm"
        >
          <Home className="w-4 h-4" />
          Return to TruthScan AI Homepage
        </Link>
      </div>
    </main>
  );
}
