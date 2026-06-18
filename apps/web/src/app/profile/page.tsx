"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { PublicUser } from "@elite-drive/types";
import { RequireAuth } from "@/features/auth/components/require-auth";
import { useAuth } from "@/features/auth/auth-context";
import { Field } from "@/features/auth/components/field";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";

function ProfileForm() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save() {
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const updated = await api.patch<PublicUser>("/users/me", {
        name,
        email,
        phone,
      });
      setUser(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Профайл</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Холбоо барих мэдээллээ шинэчлээрэй
      </p>

      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <Field
          label="Нэр"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Утасны дугаар"
          name="phone"
          prefix="+976"
          inputMode="numeric"
          maxLength={8}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        />
        <Field
          label="Имэйл"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-brand-foreground">
            <CheckCircle2 className="size-4 text-brand" />
            Хадгалагдлаа
          </p>
        )}

        <Button onClick={save} disabled={saving} size="lg">
          {saving && <Loader2 className="size-4 animate-spin" />}
          Хадгалах
        </Button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileForm />
    </RequireAuth>
  );
}
