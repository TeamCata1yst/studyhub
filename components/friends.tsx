"use client";
import { Albert_Sans } from "next/font/google";
const albert = Albert_Sans({ subsets: ["latin"] });
import React, { useState, useEffect } from "react";

import { Button } from "./ui/button";
import { BookText, Check, ShieldHalf, Users, X } from "lucide-react";
import {
  acceptFriendRequestAction,
  rejectFriendRequestAction,
} from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { createClient } from "@/utils/supabase/client";
import { useFriendsUpdater } from "@/hooks/use-friends-updater";

type Friend = {
  user_id: string;
  full_name: string;
  course: string;
  university: string;
  avatar_url: string;
};

type Request = {
  id: string;
  user_id: string;
  full_name: string | null;
  course: string | null;
  university: string | null;
};

type Props = {};

export default function Friends({}: Props) {
  const { refreshFriends } = useFriendsUpdater();
  const refreshTrigger = refreshFriends();

  const [open, setOpen] = useState(false);
  const [fs, setFriends] = useState<Friend[]>([]);
  const [rs, setRequests] = useState<Request[]>([]);

  const fetchFriends = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: pendingFriends, error: pendingFriendsError } = await supabase
      .from("friendships")
      .select("id, user_id")
      .eq("friend_id", user.id)
      .eq("status", "pending");

    const { data: friends, error: friendsError } = await supabase
      .from("friendships")
      .select("id, user_id")
      .eq("friend_id", user.id)
      .eq("status", "accepted");

    const { data: o_friends, error: oFriendsError } = await supabase
      .from("friendships")
      .select("id, friend_id")
      .eq("user_id", user.id)
      .eq("status", "accepted");

    if (pendingFriendsError) {
      console.error("Error fetching pending friends:", pendingFriendsError);
      return;
    }

    if (friendsError) {
      console.error("Error fetching friends:", friendsError);
      return;
    }

    if (oFriendsError) {
      console.error("Error fetching outgoing friends:", oFriendsError);
      return;
    }

    const friendIds = friends.map((f) => f.user_id);
    o_friends.map((f) => {
      let id = f.friend_id;
      friendIds.push(id);
    });

    const userIds = pendingFriends.map((f) => f.user_id);

    const { data: p_profiles, error: pProfilesError } = await supabase
      .from("profiles")
      .select("id, full_name, course, university")
      .in("id", userIds);

    const { data: f_profiles, error: fProfilesError } = await supabase
      .from("profiles")
      .select("id, full_name, course, university, avatar_url")
      .in("id", friendIds);

    if (pProfilesError || !p_profiles) {
      console.error("Error fetching profiles for requests:", fProfilesError);
      return;
    }

    if (fProfilesError || !f_profiles) {
      console.error("Error fetching profiles for friends:", fProfilesError);
      return;
    }

    const a_friends = friendIds.map((f) => ({
      user_id: f,
      full_name: f_profiles.find((p) => p.id === f)?.full_name || null,
      course: f_profiles.find((p) => p.id === f)?.course || null,
      university: f_profiles.find((p) => p.id === f)?.university || null,
      avatar_url: f_profiles.find((p) => p.id === f)?.avatar_url || null,
    }));

    const a_requests = pendingFriends.map((f) => ({
      id: f.id,
      user_id: f.user_id,
      full_name: p_profiles.find((p) => p.id === f.user_id)?.full_name || null,
      course: p_profiles.find((p) => p.id === f.user_id)?.course || null,
      university:
        p_profiles.find((p) => p.id === f.user_id)?.university || null,
    }));

    setFriends(a_friends);
    setRequests(a_requests);
  };

  useEffect(() => {
    fetchFriends();
  }, [refreshTrigger]);

  const acceptRequest = async (requestId: string) => {
    await acceptFriendRequestAction(requestId);
    fetchFriends();
  };

  const rejectRequest = async (requestId: string) => {
    await rejectFriendRequestAction(requestId);
    fetchFriends();
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className="absolute right-6 bottom-6 xl:hidden"
              variant="outline"
              size="icon"
            >
              <Users />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show Friends</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div
        className={
          "w-64 fixed xl:right-0 top-0 px-4 py-8 transition-all bg-background flex flex-col h-full justify-between" +
          (open ? " right-0 border-l" : " -right-full")
        }
      >
        <Button
          onClick={() => setOpen(false)}
          className="absolute right-6 top-6 xl:hidden"
          variant="ghost"
          size="icon"
        >
          <X />
        </Button>
        <div className="space-y-3">
          <h1 className={albert.className + " text-xl font-medium"}>
            Friends ({fs?.length})
          </h1>
          {fs?.map((friend) => (
            <Link
              href={`/dashboard/profile/${friend.user_id}`}
              key={friend.user_id}
              className="flex gap-3 items-center group"
              onClick={() => setOpen(false)}
            >
              <Avatar>
                <AvatarImage src={friend.avatar_url} />
                <AvatarFallback>
                  {friend.full_name
                    ?.toUpperCase()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm group-hover:underline underline-offset-4">
                  {friend.full_name || "Unknown"}
                </p>
                <p className="text-xs mt-0.5">
                  <BookText className="inline mr-1" size={14} />
                  {friend.course || "Unknown"} <br />
                  <ShieldHalf className="inline mr-1" size={14} />
                  {friend.university || "Unknown"}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="space-y-2">
          <h1 className={albert.className + " font-medium"}>
            Incoming Requests ({rs?.length})
          </h1>
          {rs?.map((request) => (
            <div key={request.id} className="space-y-1">
              <Link
                href={`/dashboard/profile/${request.user_id}`}
                className="font-medium text-sm block hover:underline underline-offset-4"
                onClick={() => setOpen(false)}
              >
                {request.full_name || "Unknown"}
              </Link>
              <small className="text-xs">
                {request.course || "Unknown"} -{" "}
                {request.university || "Unknown"}
              </small>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => acceptRequest(request.id)}
                >
                  Accept <Check />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => rejectRequest(request.id)}
                >
                  Reject <X />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
