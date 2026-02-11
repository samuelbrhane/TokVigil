import { Navbar } from "@/components/layout";
import { AuthProvider } from "@/lib/auth-context";

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
    </AuthProvider>
  );
}
