import "../globals.css";

import Navbar from "@/components/navbar";
import Onboarding from "@/components/onboarding";
import { ScrollArea } from "@/components/ui/scroll-area";
import Friends from "@/components/friends";
import { FriendsProvider } from "@/hooks/use-friends-updater";

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
}: {
  children: React.ReactNode;
}) {

  // Mock user profile (since Supabase is removed)
const profileData = {
  id: "demo-user",
  username: "demo_user",
  name: "Demo User",
  email: "demo@example.com",
  avatar_url: "",
  interests: ["coding", "study"]
};

  return (
    <>
      <FriendsProvider>
        <Navbar user={profileData} onboarding={!profileData.interests} />
        <div
          className={`${
            profileData.interests && "md:pl-20 pt-20 md:pt-3 xl:pr-64"
          } p-3 h-full`}
        >
          <ScrollArea className="p-8 bg-background border rounded-md h-full">
            {!profileData.interests && <Onboarding profile={profileData} />}
            {profileData.interests && children}
          </ScrollArea>
        </div>
        {profileData.interests && <Friends />}
      </FriendsProvider>
    </>
  );
}