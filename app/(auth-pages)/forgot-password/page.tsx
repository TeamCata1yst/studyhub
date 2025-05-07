"use client";
import { forgotPasswordAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { Albert_Sans } from "next/font/google";
import { GraduationCap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import LoginBg from "@/components/login-bg";
const albert = Albert_Sans({ subsets: ["latin"] });

export default function ForgotPassword() {
  const searchParams = useSearchParams();
  return (
    <main className="flex items-center lg:justify-normal justify-center min-h-screen">
      <LoginBg />
      <form className="bg-background rounded-md border p-8 lg:ml-32 space-y-4 text-center w-[33rem] z-20">
        <GraduationCap className="h-14 w-14 text-study-orange mx-auto" />
        <h1 className={"text-4xl font-semibold " + albert.className}>
          Forgot password?
        </h1>
        <p className="text-sm">
          No problem, we&apos;ll send you reset instructions.
          <br />
          The link will also work to sign you into the application.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="self-start">
            Email
          </Label>
          <Input
            name="email"
            id="email"
            placeholder="you@example.com"
            required
          />
          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
        <p className="text-sm text-foreground">
          <Link className="font-medium text-study-orange" href="/sign-in">
            &lt;- Go back to sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
