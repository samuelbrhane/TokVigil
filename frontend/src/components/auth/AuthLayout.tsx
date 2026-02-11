import { ReactNode } from "react";
import Logo from "@/components/layout/Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16 pb-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Logo size="lg" href="/" />
          </div>
          <h1 className="mt-6 text-xl font-bold font-mono text-surface-100">{title}</h1>
          <p className="mt-2 text-sm text-surface-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
