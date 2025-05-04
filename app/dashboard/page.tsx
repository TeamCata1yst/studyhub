"use client";
import { useHashParams } from "@/hooks/use-hash-params";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function HomePage() {
  const { toast } = useToast();

  const searchParams = useSearchParams();
  console.log(searchParams);

  const hashParams = useHashParams({
    clearAfterRead: true,
    clearDelay: 100,
  });
  console.log(hashParams);

  useEffect(() => {
    if ("message" in hashParams) {
      toast({
        description: hashParams.message,
      });
    }
  }, [hashParams]);

  return <div>hello</div>;
}
