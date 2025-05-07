"use client";
import { resetPasswordAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import LoginBg from "@/components/login-bg";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

import { Albert_Sans } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
const albert = Albert_Sans({ subsets: ["latin"] });

export default function ResetPassword() {
  const searchParams = useSearchParams();
  return (
    <main className="flex items-center lg:justify-normal justify-center min-h-screen">
      <LoginBg />
      <div className="bg-background border rounded-md p-8 lg:ml-32 space-y-4 text-center w-[33rem] z-20">
        <GraduationCap className="h-14 w-14 text-study-orange mx-auto" />
        <h1 className={"text-4xl font-semibold " + albert.className}>
          Reset password
        </h1>
        <p className="text-sm">
          Enter your new password below to complete the reset
          <br /> process. Ensure it&apos;s strong and secure.
        </p>
        <form className="flex flex-col gap-2">
          <Label htmlFor="password" className="self-start">
            New password
          </Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="New password"
            required
          />
          <Label htmlFor="confirmPassword" className="self-start">
            Confirm password
          </Label>
          <Input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm password"
            required
          />
          <SubmitButton formAction={resetPasswordAction}>
            Reset password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>
        <p className="text-sm text-foreground">
          <Link className="font-medium text-study-orange" href="/">
            &lt;- Cancel and Back to Dashboard
          </Link>
        </p>
      </div>
    </main>
  );
}
