"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Monitor, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
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
          className="text-sm rounded-md py-2 px-4 hover:underline underline-offset-4"
          href="/dashboard/settings/account"
        >
          Account
        </Link>
        <Link
          className="text-sm rounded-md py-2 px-4 bg-accent font-medium"
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
        <h2 className="font-semibold">Appearance</h2>
        <p className="text-sm">Configure your appearance settings.</p>
        <hr className="my-4" />
        <div className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="password">Theme</Label>
            <small className="text-xs pb-3 block">
              Adjust the color of the interface to your preference.
            </small>
            <div className="flex gap-3">
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        theme && theme == "light" ? "secondary" : "outline"
                      }
                      size="icon"
                      onClick={() => setTheme("light")}
                    >
                      <Sun />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Light</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        theme && theme == "dark" ? "secondary" : "outline"
                      }
                      size="icon"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dark</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        theme && theme == "system" ? "secondary" : "outline"
                      }
                      size="icon"
                      onClick={() => setTheme("system")}
                    >
                      <Monitor />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>System</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
