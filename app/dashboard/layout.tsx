import "../globals.css";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Onboarding from "@/components/onboarding";
import { ScrollArea } from "@/components/ui/scroll-area";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "StudyHub",
  description:
    "Empowering Learning Together, StudyHub is a platform that connects students to share knowledge and resources.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return (
    <>
      <Navbar user={profileData} onboarding={!profileData.interests} />
      <div
        className={`${profileData.interests && "md:pl-20 pt-20 md:pt-2"} p-2 h-full`}
      >
        <ScrollArea className="p-8 bg-background rounded-md shadow h-full">
          {!profileData.interests && <Onboarding profile={profileData} />}
          {profileData.interests && children}
        </ScrollArea>
      </div>
    </>
  );
}
