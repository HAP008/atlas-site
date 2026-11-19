/**
 * MediaSlot: a clearly labelled frame where a real screenshot or demo video will go.
 * Until a real file is added in content/features.ts, it shows "Screenshot coming" /
 * "Demo video coming", so placeholder art is never mistaken for the real app.
 */

import { Camera, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type Media = {
  kind: "screenshot" | "video";
  /** What the real image/video will show. Used as the label now and the alt text later. */
  description: string;
  /** Path under /public once the real file exists. Leave undefined until then. */
  src?: string;
};

export function MediaSlot({ media, className }: { media: Media; className?: string }) {
  const label = media.kind === "video" ? "Demo video coming" : "Screenshot coming";
  const Icon = media.kind === "video" ? Play : Camera;

  return (
    <figure
      className={cn(
        "relative flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed border-input/60 bg-muted/60 p-6 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-background text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold">{label}</span>
      <figcaption className="max-w-xs text-sm text-muted-foreground">{media.description}</figcaption>
    </figure>
  );
}
