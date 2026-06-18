"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/auth-context";

// Header дээрх профайл — дарахад шууд /profile руу шилжинэ (dropdown байхгүй).
export function UserMenu() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Link
      href="/profile"
      aria-label="Профайл"
      className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] py-1 pl-1 pr-3 text-foreground backdrop-blur transition-colors hover:bg-foreground/10 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
    >
      <Avatar className="size-7">
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
        <AvatarFallback className="bg-gradient-to-br from-brand to-orange-600 text-xs font-semibold text-white">
          {user.name.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="max-w-[120px] truncate text-sm font-medium">
        {user.name}
      </span>
    </Link>
  );
}
