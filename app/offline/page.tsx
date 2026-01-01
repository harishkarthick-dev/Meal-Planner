import { CloudOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex h-screen items-center justify-center bg-warm-white dark:bg-background">
      <div className="flex h-[80vh] flex-col items-center justify-center text-center">
        <CloudOff className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Don&apos;t worry, you can still view and modify your meal plans!
          Changes will sync when you come back online.
        </p>
      </div>
    </div>
  );
}
