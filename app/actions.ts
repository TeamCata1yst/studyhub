"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const cPassword = formData.get("confirmPassword")?.toString();
  const displayName = formData.get("fullName")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  if (!email || !password || !displayName) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email, password and name are required",
    );
  }
  if (password !== cPassword) {
    return encodedRedirect("error", "/sign-up", "Passwords do not match");
  }

  const hash = createHash("sha256").update(email).digest("hex");
  const picture = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        displayName,
        full_name: displayName,
        picture,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/dashboard/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const changeEmailAction = async (formData: FormData) => {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  console.log("change", email);

  const user = await supabase.auth.getUser();
  const curr_email = user.data.user?.email;
  if (curr_email == email || !email) {
    encodedRedirect(
      "error",
      "/dashboard/settings/account",
      "Email is same as current email.",
    );
  }

  const { error } = await supabase.auth.updateUser({
    email: email,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/settings/account",
      "Email update failed",
    );
  }

  encodedRedirect(
    "success",
    "/dashboard/settings/account",
    "Email update action started, check inboxes of both current and new email.",
  );
};

export const deleteAccountAction = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const uid = data.user?.id;

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/settings/account",
      "Account deletion failed",
    );
    return;
  }

  if (!uid) {
    encodedRedirect(
      "error",
      "/dashboard/settings/account",
      "User ID not found",
    );
    return;
  }

  try {
    const { data: files, error: listError } = await supabase.storage
      .from("avatars")
      .list(uid);
    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${uid}/${file.name}`);

      const { error: deleteFilesError } = await supabase.storage
        .from("avatars")
        .remove(filePaths);

      if (deleteFilesError) {
        console.error("Error deleting avatar files:", deleteFilesError);
      }
    }
  } catch (error) {
    console.error("Error deleting storage:", error);
  }

  const { error: deleteError } = await supabase.rpc("delete_user");

  if (deleteError) {
    console.error("Error deleting user:", deleteError);
    return;
  }

  await supabase.auth.signOut();

  redirect("/sign-in");
};

export const sendFriendRequestAction = async (uid: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("send_friend_request", {
    friend_id: uid,
  });

  if (error) {
    console.error("Error sending friend request:", error);
  }
  return { success: !error && data !== null, requestId: data };
};

export const acceptFriendRequestAction = async (rid: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("accept_friend_request", {
    request_id: rid,
  });

  if (error) {
    console.error("Error accepting friend request:", error);
  }
  return { success: !error && !!data };
};

export const rejectFriendRequestAction = async (rid: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("reject_friend_request", {
    request_id: rid,
  });

  if (error) {
    console.error("Error rejecting friend request:", error);
  }
  return { success: !error && !!data };
};

export const removeFriendAction = async (fid: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("remove_friend", {
    friend_id: fid,
  });

  if (error) {
    console.error("Error removing friend:", error);
  }
  return { success: !error && !!data };
};

export const cancelRequestAction = async (rid: string) => {
  const supabase = await createClient();
  console.log(rid);

  const { data, error } = await supabase.rpc("cancel_friend_request", {
    request_id: rid,
  });

  console.log(data, error);

  if (error) {
    console.error("Error canceling friend request:", error);
  }
  return { success: !error && !!data };
};
