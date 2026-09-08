import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/animations/SmoothScrollProvider";
import { CursorSpotlight } from "@/components/ui/CursorSpotlight";
import { MobileTouchSparkles } from "@/components/animations/MobileTouchSparkles";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <CursorSpotlight />
      <MobileTouchSparkles />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SmoothScrollProvider>
  );
}
