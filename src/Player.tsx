import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { getBookConfig } from "@/config/book.config";
import { loadTocData } from "@/config/toc.config";
import { loadPageLinks } from "@/config/pages.config";
import { useBookStore } from "@/store/useBookStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useNotesStore } from "@/store/useNotesStore";
import { useDrawingStore } from "@/store/useDrawingStore";
import { useUIStore } from "@/store/useUIStore";
import { initStoragePrefix, initPageAspectRatio } from "@/utils/constants";
// import AccessibilityPanel from "./accessibility/AccessibilityPanel";
import type { BookConfig } from "@/types/book.types";
import PreLoader from "@/components/layout/PreLoader";
import AppLayout from "@/components/layout/AppLayout";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-brand-900 via-brand-800 to-brand-950">
      <div className="text-center">
        <div className="mb-6 inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand-400 border-t-transparent" />
        <p className="text-lg text-brand-200 font-light">Loading book data…</p>
      </div>
    </div>
  );
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-red-900 via-red-800 to-red-950">
      <div className="text-center max-w-md">
        <div className="mb-4 text-5xl">⚠️</div>
        <h1 className="mb-4 text-2xl font-bold text-white">
          Failed to Load Book
        </h1>
        <p className="text-red-200 mb-6">{error}</p>
        <p className="text-red-300 text-sm">
          Make sure the data files exist in{" "}
          <code className="bg-white/10 px-2 py-0.5 rounded">public/data/</code>
        </p>
      </div>
    </div>
  );
}

function Player() {
  const [config, setConfig] = useState<BookConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const initialize = useBookStore((s) => s.initialize);
  const setPreloaderVisible = useUIStore((s) => s.setPreloaderVisible);

  useEffect(() => {
    async function bootstrap() {
      try {
        // Load all config data in parallel
        const [bookConfig] = await Promise.all([
          getBookConfig(),
          loadTocData(),
          loadPageLinks(),
        ]);

        // Initialize storage prefix with the book ID
        initStoragePrefix(bookConfig.id);

        // Re-hydrate stores now that STORAGE_PREFIX points to the correct book
        useNotesStore.getState().rehydrate();
        useDrawingStore.getState().rehydrate();
        useBookmarkStore.getState().rehydrate();

        // Initialize aspect ratio from book dimensions
        initPageAspectRatio(bookConfig.bookWidth, bookConfig.bookHeight);

        // Initialize the book store with dynamic totalPages
        initialize(bookConfig.totalPages);

        // Set the page title dynamically from config
        document.title = `${bookConfig.subject} — ${bookConfig.class}`;

        setConfig(bookConfig);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error loading data";
        setError(message);
        console.error("Bootstrap failed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();
  }, [initialize, setPreloaderVisible]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (!config) return null;

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "Inter, system-ui, sans-serif",
          },
        }}
      />

      {/* Preloader overlay */}
      {showPreloader && (
        <PreLoader
          onComplete={() => {
            setShowPreloader(false);
            setPreloaderVisible(false);
          }}
        />
      )}

      {/* Main App */}
      <AppLayout />
      {/* <AccessibilityPanel /> */}
    </>
  );
}

export default Player;
