"use client";
import { SubmitButton } from "@/components/submit-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { changeEmailAction } from "@/app/actions";
import EditInput from "@/components/edit-input";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FormMessage } from "@/components/form-message";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const message = useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data || !data.user) return;
      const { email } = data.user;
      if (!email) return;
      setEmail(email);
    }
    fetchUser();
  }, []);
  return (
    <>
      <nav className="flex flex-col gap-2 w-1/6">
        <Link
          className="text-sm rounded-md py-2 px-4 hover:underline underline-offset-4"
          href="/dashboard/settings/"
        >
          Profile
        </Link>
        <Link
          className="text-sm rounded-md py-2 px-4 bg-accent font-medium"
          href="/dashboard/settings/account"
        >
          Account
        </Link>
        <Link
          className="text-sm rounded-md py-2 px-4 hover:underline underline-offset-4"
          href="/dashboard/settings/appearance"
        >
          Appearance
        </Link>
        <Link
          className="text-sm rounded-md py-2 px-4 hover:underline underline-offset-4"
          href="/dashboard/settings/other"
        >
          Other
        </Link>
      </nav>
      <div className="md:w-1/2">
        <h2 className="font-semibold pb-1">Account</h2>
        <p className="text-sm">Update your account settings.</p>
        <hr className="my-4" />
        <div className="space-y-6">
          <form className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <EditInput
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <FormMessage message={searchParams} />
            <small className="text-xs pb-3 block">
              This is your email address. It is used to log in to your account.
            </small>
            <SubmitButton
              pendingText="Changing..."
              formAction={changeEmailAction}
            >
              Change Email
            </SubmitButton>
          </form>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <small className="text-xs pb-3 block">
              This is your email address. It is used to log in to your account.
            </small>
            <Link
              href="/dashboard/reset-password"
              className={buttonVariants({ variant: "outline" })}
            >
              Change Password
            </Link>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Account Removal</Label>
            <small className="text-xs pb-3 block">
              This action isn't automatic, it will send us a request to delete
              your account.
            </small>
            <div className="flex gap-4">
              <Button variant="destructive">Delete Account</Button>
              <Button variant="outline">Disable Account</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
