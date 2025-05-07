"use client";
import { signInAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { Albert_Sans } from "next/font/google";
const albert = Albert_Sans({ subsets: ["latin"] });

import GoogleButton from "@/components/google-button";
import { GraduationCap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import LoginBg from "@/components/login-bg";

export default function Login() {
  const searchParams = useSearchParams();
  return (
    <main className="flex items-center lg:justify-normal justify-center min-h-screen">
      <LoginBg />

      <div className="bg-background rounded-md border p-8 lg:ml-32 space-y-4 text-center w-[33rem] z-20">
        <GraduationCap className="h-14 w-14 text-study-orange mx-auto" />
        <h1 className={"text-4xl font-semibold " + albert.className}>
          Welcome
        </h1>
        <p className="text-sm">
          Glad to see you again 👋
          <br />
          Login to your account below
        </p>
        <GoogleButton />
        <form className="flex flex-col gap-2">
          <Label htmlFor="email" className="self-start">
            Email
          </Label>
          <Input
            name="email"
            id="email"
            placeholder="example@gmail.com"
            required
          />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>
        <p className="text-sm text-foreground">
          Don&apos;t have an account?{" "}
          <Link className="font-medium text-study-orange" href="/sign-up">
            Sign up for free
          </Link>
        </p>
      </div>
    </main>
  );
}
