import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/animations/SmoothScrollProvider";
import { CursorSpotlight } from "@/components/ui/CursorSpotlight";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <CursorSpotlight />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SmoothScrollProvider>
  );
}
