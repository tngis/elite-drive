import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { OtpAuthForm } from "@/features/auth/components/otp-auth-form";

export const metadata: Metadata = {
  title: "Бүртгүүлэх — Elite Drive",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Бүртгэл үүсгэх"
      subtitle="Утас эсвэл имэйлээрээ хэдхэн алхамд бүртгүүлээрэй"
      footer={
        <>
          Бүртгэлтэй юу?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Нэвтрэх
          </Link>
        </>
      }
    >
      <Suspense>
        <OtpAuthForm mode="register" />
      </Suspense>
    </AuthShell>
  );
}
