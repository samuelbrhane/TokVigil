import { Navbar, Footer } from "@/components/layout";
import { AuthProvider } from "@/lib/auth-context";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  );
}
