"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signOutAction } from "@/app/actions";
import { House, LogOut, Settings } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type Props = {
  user: {
    id: string;
    updated_at: string;
    full_name: string;
    avatar_url: string;
  };
  onboarding: boolean;
};

export default function Navbar({ user, onboarding }: Props) {
  return (
    <nav
      className={`flex justify-between items-center md:flex-col fixed right-0 md:right-auto top-0 md:bottom-0 p-4 md:py-8 bg-accent transition-all ${onboarding ? "md:-left-20" : "left-0"}`}
    >
      <Link href="/dashboard">
        <Image
          src="/logo_rotated.svg"
          alt="StudyHub Logo"
          width={100}
          height={100}
          className="h-36 w-12 md:block hidden"
        />
        <Image
          src="/logo.svg"
          alt="StudyHub Logo"
          width={100}
          height={100}
          className="h-12 w-36 md:hidden"
        />
      </Link>
      <TooltipProvider>
        <div className="flex md:flex-col items-center gap-6">
          <div className="flex md:flex-col items-center gap-4" id="icons">
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                >
                  <House />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={signOutAction} size="icon">
                  <LogOut />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign Out</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/settings"
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                >
                  <Settings />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Link href="/dashboard/profile">
                <Avatar>
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>
                    {user.full_name
                      .toUpperCase()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </nav>
  );
}
