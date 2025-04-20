import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { Albert_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/google-button";
import { GraduationCap } from "lucide-react";
const albert = Albert_Sans({ subsets: ["latin"] });

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <main className="flex items-center lg:justify-normal justify-center min-h-screen">
      <div className="absolute hidden md:block bottom-0 right-0 bg-[url('/loginBg.svg')] h-screen w-screen bg-right-bottom -z-10 bg-no-repeat"></div>

      <div className="bg-white rounded-md p-8 lg:ml-32 space-y-4 text-center w-[50rem] z-20">
        <GraduationCap className="h-14 w-14 text-study-orange mx-auto" />
        <h1 className={"text-4xl font-semibold " + albert.className}>
          Sign up
        </h1>
        <p className="text-sm">
          Enter your details below to create your account and get started.
        </p>
        <GoogleButton />
        <form className="grid md:grid-cols-2 gap-3">
          <div className="space-y-1 text-start">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              name="fullName"
              id="fullName"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-1 text-start">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              placeholder="johndoe@example.com"
              required
            />
          </div>
          <div className="space-y-1 text-start">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              required
            />
          </div>
          <div className="space-y-1 text-start">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="********"
              required
            />
          </div>
          <SubmitButton
            formAction={signUpAction}
            pendingText="Signing up..."
            className="col-span-2"
          >
            Sign up
          </SubmitButton>
        </form>
        <FormMessage message={searchParams} />
        <p className="text-sm">
          Already have an account?{" "}
          <Link className="font-medium text-study-orange" href="/sign-in">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
