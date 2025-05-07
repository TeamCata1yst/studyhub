"use client";
import { useHashParams } from "@/hooks/use-hash-params";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function HomePage() {
  const { toast } = useToast();

  const hashParams = useHashParams({
    clearAfterRead: true,
    clearDelay: 100,
  });

  useEffect(() => {
    if ("message" in hashParams) {
      toast({
        description: hashParams.message,
      });
    }
  }, [hashParams]);

  return <div>hello</div>;
}
