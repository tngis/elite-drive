"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, Phone, Mail } from "lucide-react";
import type { OtpChannel } from "@elite-drive/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field } from "./field";
import { useAuth } from "../auth-context";
import { ApiError } from "@/lib/api-client";

type Step = "identify" | "verify";

export function OtpAuthForm({ mode }: { mode: "login" | "register" }) {
  const { requestOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [channel, setChannel] = useState<OtpChannel>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [needName, setNeedName] = useState(mode === "register");

  const [step, setStep] = useState<Step>("identify");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destination = channel === "phone" ? phone : email;

  async function handleRequest() {
    setError(null);
    setLoading(true);
    try {
      const res = await requestOtp({
        channel,
        phone: channel === "phone" ? phone : undefined,
        email: channel === "email" ? email : undefined,
      });
      setDevCode(res.devCode);
      setStep("verify");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Код илгээхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setError(null);
    setLoading(true);
    try {
      await verifyOtp({
        channel,
        phone: channel === "phone" ? phone : undefined,
        email: channel === "email" ? email : undefined,
        code,
        name: needName ? name : undefined,
      });
      router.replace(redirectTo);
    } catch (err) {
      if (err instanceof ApiError && err.code === "NAME_REQUIRED") {
        setNeedName(true);
        setError("Шинэ хэрэглэгч байна — нэрээ оруулаад дахин баталгаажуулна уу");
      } else {
        setError(err instanceof ApiError ? err.message : "Баталгаажуулахад алдаа гарлаа");
      }
    } finally {
      setLoading(false);
    }
  }

  if (step === "verify") {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            setStep("identify");
            setCode("");
            setError(null);
          }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Буцах
        </button>

        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {channel === "phone" ? `+976 ${phone}` : email}
          </span>{" "}
          руу илгээсэн 6 оронтой кодыг оруулна уу.
        </p>

        {devCode && (
          <p className="rounded-lg bg-brand/15 px-3 py-2 text-center text-sm font-medium text-brand-foreground">
            Демо код: <span className="font-mono text-base">{devCode}</span>
          </p>
        )}

        <Field
          label="Баталгаажуулах код"
          name="code"
          inputMode="numeric"
          placeholder="123456"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />

        {needName && (
          <Field
            label="Нэр"
            name="name"
            placeholder="Таны нэр"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          className="w-full"
          size="lg"
          disabled={loading || code.length !== 6}
          onClick={handleVerify}
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Баталгаажуулах
        </Button>

        <button
          type="button"
          onClick={handleRequest}
          disabled={loading}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Код дахин авах
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={channel} onValueChange={(v) => setChannel(v as OtpChannel)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phone" className="gap-1.5">
            <Phone className="size-4" />
            Утас
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-1.5">
            <Mail className="size-4" />
            Имэйл
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "register" && (
        <Field
          label="Нэр"
          name="name"
          placeholder="Таны нэр"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      {channel === "phone" ? (
        <Field
          label="Утасны дугаар"
          name="phone"
          prefix="+976"
          inputMode="numeric"
          placeholder="99112233"
          maxLength={8}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        />
      ) : (
        <Field
          label="Имэйл хаяг"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        className="w-full"
        size="lg"
        disabled={loading || !destination || (mode === "register" && !name)}
        onClick={handleRequest}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        Код авах
      </Button>
    </div>
  );
}
