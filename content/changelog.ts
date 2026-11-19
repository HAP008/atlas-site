/**
 * Changelog entries, newest first. Dates are YYYY-MM-DD.
 * `titleIfWaitlistOff` is shown instead when the build has no waitlist endpoint,
 * so the changelog never claims the waitlist is open when it isn't.
 */

export type ChangelogEntry = {
  date: string;
  title: string;
  titleIfWaitlistOff?: string;
};

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-11-19",
    title: "Site launched, waitlist open.",
    titleIfWaitlistOff: "Site launched. The waitlist form isn't connected yet.",
  },
];
