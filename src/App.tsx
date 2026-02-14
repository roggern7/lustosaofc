import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Safety net: if some overlay/modal library leaves the page in a scroll-locked state,
  // unlock it on app mount.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const unlockIfLocked = (el: HTMLElement) => {
      if (el.style.overflow === "hidden") el.style.overflow = "";
      if (el.style.position === "fixed") el.style.position = "";
      if (el.style.touchAction === "none") el.style.touchAction = "";
    };

    unlockIfLocked(html);
    unlockIfLocked(body);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogo" element={<Catalog />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
