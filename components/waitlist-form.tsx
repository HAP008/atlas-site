"use client";

/**
 * WaitlistForm: email + 18+ confirmation, posted to the form service without a page reload.
 *
 * States: not connected (no endpoint) · idle · submitting · success · error, plus inline
 * errors for a bad email and the unchecked 18+ box. A filled honeypot shows success
 * but sends nothing, so bots learn nothing.
 * Depends on: lib/waitlist.ts (submit), shadcn Button/Input/Checkbox/Label.
 * If the service is down, the visitor sees the error state with our email address.
 * Never logs anything: the email address is personal data.
 */

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { isValidEmail, submitToWaitlist, type WaitlistResult } from "@/lib/waitlist";
import { siteConfig } from "@/site.config";

type Status = "idle" | "submitting" | "success" | "error";

// shadcn's soft focus ring is hard to see next to the red error ring; use the site's solid outline.
const FOCUS_OUTLINE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring";
type FieldErrors = { email?: string; age?: string };

const MESSAGES = {
  emailMissing: "Enter your email address.",
  emailInvalid: "That doesn't look like an email address. Check for a missing @ or a typo.",
  emailRejected: "The waitlist didn't accept that email address. Check it and try again.",
  ageMissing: "Please confirm you're 18 or older. ATLAS is for adults only.",
  rateLimited: "Too many tries in a short time. Wait a minute, then try again.",
  failed: "Your sign-up didn't go through. Check your connection and try again.",
} as const;

function ContactEmail() {
  return (
    <a
      href={`mailto:${siteConfig.contactEmail}`}
      className="font-medium [overflow-wrap:anywhere] underline underline-offset-4"
    >
      {siteConfig.contactEmail}
    </a>
  );
}

export function WaitlistForm({
  endpoint,
  className,
}: {
  endpoint: string | null;
  className?: string;
}) {
  const id = useId();
  const emailId = `${id}-email`;
  const ageId = `${id}-age`;
  const emailErrorId = `${id}-email-error`;
  const ageErrorId = `${id}-age-error`;
  // Neutral id so password managers and autofill don't mistake the honeypot for a real field.
  const honeypotId = `${id}-hp`;

  const [email, setEmail] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLButtonElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the confirmation so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  if (!endpoint) {
    return (
      <div className={cn("rounded-2xl border border-border bg-card p-5 sm:p-6", className)}>
        <h3 className="font-sans text-base font-semibold">The waitlist isn&apos;t connected yet.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The sign-up form will open here soon. Until then, email <ContactEmail /> with the subject
          &ldquo;ATLAS waitlist&rdquo; and say you&apos;re 18 or older, and I&apos;ll add you by hand.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        className={cn("rounded-2xl border border-primary/30 bg-card p-5 sm:p-6", className)}
        role="status"
      >
        <h3
          ref={successRef}
          tabIndex={-1}
          className="font-sans text-base font-semibold text-primary focus:outline-none"
        >
          You&apos;re on the waitlist.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We&apos;ll email you when ATLAS launches. That&apos;s the only thing we use your address for.
          Changed your mind? Email <ContactEmail /> and we&apos;ll delete it within{" "}
          {siteConfig.deletionDays} days.
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !endpoint) return;

    setFormError(null);
    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = MESSAGES.emailMissing;
    else if (!isValidEmail(email)) errors.email = MESSAGES.emailInvalid;
    if (!ageConfirmed) errors.age = MESSAGES.ageMissing;
    // Commit the errors before moving focus, so the field already has aria-invalid and its
    // error description when a screen reader announces it.
    flushSync(() => setFieldErrors(errors));

    if (errors.email) {
      emailRef.current?.focus();
      return;
    }
    if (errors.age) {
      ageRef.current?.focus();
      return;
    }

    // Honeypot: people never see or reach this field. If it has a value, a bot filled it.
    if (honeypotRef.current?.value) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    const result: WaitlistResult = await submitToWaitlist(endpoint, email);
    switch (result.kind) {
      case "success":
        setStatus("success");
        return;
      case "invalid-email":
        flushSync(() => {
          setStatus("idle");
          setFieldErrors({ email: MESSAGES.emailRejected });
        });
        emailRef.current?.focus();
        return;
      case "rate-limited":
        setStatus("error");
        setFormError(MESSAGES.rateLimited);
        return;
      default:
        setStatus("error");
        setFormError(MESSAGES.failed);
    }
  }

  return (
    <form
      // If someone submits before JavaScript loads, the browser posts straight to the form
      // service (never a GET to our own page, which would put the email in a URL and in logs).
      method="post"
      action={endpoint}
      noValidate
      onSubmit={handleSubmit}
      aria-busy={submitting}
      aria-label="Join the ATLAS waitlist"
      className={cn("space-y-4", className)}
    >
      <div className="space-y-2">
        <Label htmlFor={emailId} className="text-sm font-medium">
          Email address
        </Label>
        <Input
            ref={emailRef}
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-required="true"
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? emailErrorId : undefined}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className="h-12 rounded-full bg-card px-5 text-base"
          />
        {fieldErrors.email && (
          <p id={emailErrorId} className="text-sm text-destructive">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-3">
          <Checkbox
            ref={ageRef}
            id={ageId}
            name="age_confirmed"
            checked={ageConfirmed}
            onCheckedChange={(value) => {
              setAgeConfirmed(value === true);
              if (fieldErrors.age) setFieldErrors((prev) => ({ ...prev, age: undefined }));
            }}
            aria-required="true"
            aria-invalid={fieldErrors.age ? true : undefined}
            aria-describedby={fieldErrors.age ? ageErrorId : undefined}
            className={cn("mt-0.5 size-5 border-input", FOCUS_OUTLINE)}
          />
          <Label htmlFor={ageId} className="text-sm leading-snug font-normal">
            I&apos;m 18 or older.
          </Label>
        </div>
        {fieldErrors.age && (
          <p id={ageErrorId} className="pl-8 text-sm text-destructive">
            {fieldErrors.age}
          </p>
        )}
      </div>

      {/* Honeypot. Hidden from people and screen readers; bots tend to fill every field. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={honeypotId}>Leave this field empty</label>
        {/* data-* attributes tell 1Password, LastPass and similar tools to leave it alone. */}
        <input
          ref={honeypotRef}
          id={honeypotId}
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore=""
          data-lpignore="true"
          data-form-type="other"
        />
      </div>

      <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
        We&apos;ll only use your email to tell you when ATLAS launches. By joining, you agree to the{" "}
        <Link href="/terms/" className="underline underline-offset-4 hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy/" className="underline underline-offset-4 hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>

      {/* Submit comes last so keyboard focus order matches reading order: email → 18+ → submit. */}
      <Button
        type="submit"
        aria-disabled={submitting || undefined}
        className={cn("h-12 w-full rounded-full px-7 text-base aria-disabled:opacity-70 sm:w-auto", FOCUS_OUTLINE)}
      >
        {submitting ? "Joining…" : "Join the waitlist"}
      </Button>

      {/* Always in the DOM so screen readers announce the message when it appears. */}
      <div role="alert">
        {formError && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm">
            {formError} If it keeps happening, email <ContactEmail /> and I&apos;ll add you by hand.
          </p>
        )}
      </div>
    </form>
  );
}
