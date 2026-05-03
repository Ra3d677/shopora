import Link from "next/link";
import { Store, ShieldCheck, ArrowRight } from "lucide-react";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary">
            Welcome to Multo
          </h1>
          <p className="text-xl text-muted-foreground">
            Development Navigation Portal
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Link 
            href="/auth/login"
            className="group flex flex-col items-center p-8 bg-card border-2 border-border rounded-3xl hover:border-blue-600 hover:shadow-lg transition-all duration-300"
          >
            <div className="h-16 w-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Login</h2>
            <p className="text-muted-foreground text-center">
              Sign in to manage your existing store.
            </p>
          </Link>

          <Link 
            href="/auth/register"
            className="group flex flex-col items-center p-8 bg-card border-2 border-border rounded-3xl hover:border-emerald-500 hover:shadow-lg transition-all duration-300"
          >
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ArrowRight size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Get Started</h2>
            <p className="text-muted-foreground text-center">
              Create your account and launch a new store.
            </p>
          </Link>

          <Link 
            href="/store/mikel"
            className="group flex flex-col items-center p-8 bg-card border-2 border-border rounded-3xl hover:border-purple-500 hover:shadow-lg transition-all duration-300"
          >
            <div className="h-16 w-16 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Store size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Demo Store</h2>
            <p className="text-muted-foreground text-center">
              Explore the default LUXE storefront experience.
            </p>
          </Link>
        </div>


        
      </div>
    </div>
  );
}
