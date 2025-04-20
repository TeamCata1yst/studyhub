import Profile from "@/components/profile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

function isValidUUID(uuid: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid,
  );
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  if (!isValidUUID(slug)) {
    redirect("/dashboard/profile");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", slug)
    .maybeSingle();

  if (!profileData) {
    redirect("/dashboard/profile");
  }

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (currentUser?.id === slug) {
    redirect("/dashboard/profile");
  }

  return <Profile user_id={slug} />;
}
