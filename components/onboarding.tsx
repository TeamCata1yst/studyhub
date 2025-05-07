"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/actions";
import InterestInput from "./interests";
import { LogOut, MoveRight } from "lucide-react";

import { Albert_Sans } from "next/font/google";
import { useToast } from "@/hooks/use-toast";
const albert = Albert_Sans({ subsets: ["latin"] });

type Props = {
  profile: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
  };
};

export default function Onboarding({ profile }: Props) {
  const { toast } = useToast();

  const [interests, setInterests] = useState<string[]>([]);
  const nextPage = (i: number) => {
    const current_page = document.getElementById(`p${i}`);
    const page = document.getElementById(`p${i + 1}`);
    if (current_page && page) {
      current_page.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 300,
        easing: "ease-in-out",
        fill: "forwards",
      });
      page.style.display = "block";
      page.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        delay: 300,
        easing: "ease-in-out",
        fill: "forwards",
      });
      setTimeout(() => {
        current_page.style.display = "none";
      }, 300);
    }
  };

  const uniSubmitAction = async (formData: FormData) => {
    const uni = formData.get("uni") as string;
    const crs = formData.get("course") as string;
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ university: uni, course: crs })
      .eq("id", profile.id);
    if (error) {
      console.error(error);
    }
    nextPage(2);
  };

  const interestsSubmitAction = async (formData: FormData) => {
    if (interests.length < 3) {
      toast({
        description: "Please enter at least 3 interests",
        variant: "destructive",
      });
      return;
    }
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ interests })
      .eq("id", profile.id);
    if (error) {
      console.error(error);
    }
    nextPage(3);
  };

  return (
    <>
      <Button variant="outline" size="icon" onClick={signOutAction}>
        <LogOut />
      </Button>
      <div
        className="space-y-4 w-full md:w-1/3 p-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        id="p1"
      >
        <h1 className={albert.className + " text-4xl font-medium"}>
          Welcome {profile.full_name} to a new way of learning.
        </h1>
        <Button className="w-full" onClick={() => nextPage(1)}>
          Start Learning <MoveRight />
        </Button>
      </div>
      <div
        className="space-y-4 hidden opacity-0 w-full md:w-1/2 p-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        id="p2"
      >
        <h1 className={albert.className + " text-4xl font-medium"}>
          StudyHub connects you to a global community of learners just like you.
        </h1>
        <p className={albert.className + " text-xl"}>
          Enter your academic details to get started.
        </p>
        <form className="space-y-2">
          <Label htmlFor="uni">
            University/Institute
            <Input
              name="uni"
              id="uni"
              placeholder="Eg: Guru Gobind Singh Indraprastha University"
              required
            />
          </Label>
          <Label htmlFor="course">
            Course
            <Input
              name="course"
              id="course"
              placeholder="Eg: B.Tech (CSE)"
              required
            />
          </Label>
          <Button type="submit" className="w-full" formAction={uniSubmitAction}>
            Continue <MoveRight />
          </Button>
        </form>
      </div>
      <div
        className="space-y-4 hidden opacity-0 w-full md:w-1/2 p-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        id="p3"
      >
        <h1 className={albert.className + " text-4xl font-medium"}>
          StudyHub connects you to students with similar interests and goals.
        </h1>
        <p className={albert.className + " text-xl"}>
          Enter your interests to continue. Mention atleast 3 interests.
        </p>
        <form className="space-y-2">
          <InterestInput
            onChange={(ins: string[]) => {
              setInterests(ins);
            }}
          />
          <Button
            type="submit"
            className="w-full"
            formAction={interestsSubmitAction}
          >
            Continue <MoveRight />
          </Button>
        </form>
      </div>
      <div
        className="space-y-4 hidden opacity-0 w-full md:w-1/2 p-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        id="p4"
      >
        <h1 className={albert.className + " text-4xl font-medium"}>
          You are now connected to the StudyHub community.
        </h1>
        <p className={albert.className + " text-xl"}>
          Explore the StudyHub community and connect with students who share
          your interests and goals.
        </p>
        <Button className="w-full" onClick={() => location.reload()}>
          Continue <MoveRight />
        </Button>
      </div>
    </>
  );
}
