import { PageHeader } from "@/components/page-header";
import { isWaitlistConnected } from "@/components/waitlist";
import { changelog } from "@/content/changelog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Changelog",
  description: "What's changed on the ATLAS site and app.",
  path: "/changelog/",
});

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function ChangelogPage() {
  const waitlistOn = isWaitlistConnected();
  return (
    <>
      <PageHeader eyebrow="Changelog" title="What's new" />
      <ol className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        {changelog.map((entry) => (
          <li key={entry.date + entry.title} className="grid gap-2 border-t border-border pt-6 sm:grid-cols-[10rem_1fr]">
            <time dateTime={entry.date} className="text-sm text-muted-foreground">
              {dateFormat.format(new Date(`${entry.date}T00:00:00Z`))}
            </time>
            <p className="text-lg">{!waitlistOn && entry.titleIfWaitlistOff ? entry.titleIfWaitlistOff : entry.title}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
