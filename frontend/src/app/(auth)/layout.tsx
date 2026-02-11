import { Navbar } from "@/components/layout";

export default function AuthPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
