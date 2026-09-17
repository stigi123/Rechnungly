"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { trackCreateClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function CreateCta({ className }: { className?: string }) {
  return (
    <Link
      href="/erstellen"
      onClick={() => trackCreateClick()}
      className={cn(buttonVariants({ size: "lg" }), "h-11 px-5", className)}
    >
      Rechnung erstellen
    </Link>
  );
}
