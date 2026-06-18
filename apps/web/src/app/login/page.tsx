import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { OtpAuthForm } from "@/features/auth/components/otp-auth-form";

export const metadata: Metadata = {
  title: "Нэвтрэх — Elite Drive",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Тавтай морил"
      subtitle="Утас эсвэл имэйлээрээ нэвтэрнэ үү"
      footer={
        <>
          Бүртгэлгүй юу?{" "}
          <Link href="/register" className="font-medium text-foreground hover:underline">
            Бүртгүүлэх
          </Link>
        </>
      }
    >
      <Suspense>
        <OtpAuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
