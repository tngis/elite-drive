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
      title={user.name}
      className="rounded-full transition-opacity hover:opacity-90"
    >
      <Avatar className="size-10">
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
        <AvatarFallback className="bg-gradient-to-br from-brand to-orange-600 text-sm font-semibold text-white">
          {user.name.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
