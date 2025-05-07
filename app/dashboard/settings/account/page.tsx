"use client";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { changeEmailAction, deleteAccountAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import EditInput from "@/components/edit-input";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FormMessage } from "@/components/form-message";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function AccountSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!data || !data.user) return;
        const { email } = data.user;
        if (!email) return;
        setEmail(email);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const resetPasswordSettingsAction = async (formData: FormData) => {
    const supabase = createClient();

    if (!password || !confirmPassword) {
      console.error("Passwords are required");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (!error) {
      location.reload();
    } else {
      toast({ description: "Failed to update password: " + error.message });
    }
  };

  return (
    <>
      <nav className="flex md:flex-col gap-2 md:w-1/6">
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
      {loading ? (
        <div>Loading...</div>
      ) : (
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
                This is your email address. It is used to log in to your
                account.
              </small>
              <SubmitButton
                variant="secondary"
                pendingText="Changing..."
                formAction={changeEmailAction}
              >
                Change Email
              </SubmitButton>
            </form>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <small className="text-xs pb-3 block">
                This is your email address. It is used to log in to your
                account.
              </small>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <form className="space-y-3">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Anyone who has this link will be able to view this.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                      />
                      <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <SubmitButton
                        disabled={
                          password.length < 6 || password !== confirmPassword
                        }
                        formAction={resetPasswordSettingsAction}
                      >
                        Save Changes
                      </SubmitButton>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Account Removal</Label>
              <small className="text-xs pb-3 block">
                This action cannot be undone. It will delete all your data
                permanently.
              </small>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. Are you sure you want to
                      permanently delete your account?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="destructive" onClick={deleteAccountAction}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
