"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "../auth-context";

// Нэвтрэлт шаардсан хуудсыг хамгаална. Нэвтрээгүй бол /login руу.
export function RequireAuth({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (adminOnly && !user.isAdmin) {
      router.replace("/");
    }
  }, [user, loading, adminOnly, pathname, router]);

  if (loading || !user || (adminOnly && !user.isAdmin)) {
    return (
      <div className="grid place-items-center py-32 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
