"use client";
import { SubmitButton } from "@/components/submit-button";
import { createClient } from "@/utils/supabase/client";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState, useEffect } from "react";
import { encodedRedirect } from "@/utils/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profileData) {
            setId(profileData.id);
            setDisplayName(profileData.full_name || "");
            setBio(profileData.bio || "");
            setAvatar(profileData.avatar_url);
            setP_avatar(profileData.avatar_url);
            setUrls(profileData.urls || []);
            setUrlCount(profileData.urls?.length || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  const [avatar, setAvatar] = useState("");
  const [p_avatar, setP_avatar] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [id, setId] = useState("");
  const [urlCount, setUrlCount] = useState(0);

  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0];
    setAvatar(URL.createObjectURL(file));
  };

  const profileUpdateAction = async (formData: FormData) => {
    const supabase = createClient();

    if (avatar !== p_avatar) {
      const file = formData.get("avatar") as File;

      const fileName = `${id}/${file.name}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
      }
    }

    const u_urls = urls.filter((url) => url !== "");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: displayName,
        bio,
        urls: u_urls,
      })
      .eq("id", id);

    if (error) {
      encodedRedirect("error", "/dashboard/settings", "Profile update failed");
    }

    encodedRedirect("success", "/dashboard/settings", "Profile updated");
  };

  return (
    <>
      <nav className="flex md:flex-col gap-2 md:w-1/6">
        <Link
          className="text-sm rounded-md py-2 px-4 bg-accent font-medium"
          href="/dashboard/settings/"
        >
          Profile
        </Link>
        <Link
          className="text-sm rounded-md py-2 px-4 hover:underline underline-offset-4"
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
        <p>Loading...</p>
      ) : (
        <div className="md:w-1/2">
          <h2 className="font-semibold pb-1">Profile</h2>
          <p className="text-sm">
            This is how others will see you on the site.
          </p>
          <hr className="my-4" />
          <form className="space-y-6">
            <div className="flex gap-4">
              <Avatar className="w-24 h-24 flex-shrink-0">
                <AvatarImage src={avatar} />
                <AvatarFallback>
                  {displayName
                    .toUpperCase()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 w-full">
                <Label htmlFor="avatar">Avatar</Label>
                <Input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <small className="text-xs">
                  Your avatar is your profile picture. You can upload a new one
                  here.
                </small>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <small className="text-xs">
                This is your public display name. It can be your real name or a
                pseudonym.
              </small>
            </div>
            <div className="space-y-1">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter your bio here..."
              />
              <small className="text-xs">
                Your bio is a short description of yourself. It can be used to
                introduce yourself to others.
              </small>
            </div>
            <div className="space-y-1">
              <Label className="block">URLs</Label>
              <small className="text-xs block">
                Add links to your website, blog, or social media profiles.
              </small>
              {Array.from(Array(urlCount)).map((u, i) => (
                <Input
                  value={urls[i] ?? ""}
                  key={i}
                  placeholder="https://www.example.com/"
                  onChange={(e) => {
                    urls[i] = e.target.value;
                    setUrls([...urls]);
                  }}
                />
              ))}
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  setUrlCount(urlCount + 1);
                }}
              >
                <Plus />
              </Button>
            </div>
            <SubmitButton
              variant="secondary"
              pendingText="Updating..."
              formAction={profileUpdateAction}
            >
              Update Profile
            </SubmitButton>
          </form>
        </div>
      )}
    </>
  );
}
