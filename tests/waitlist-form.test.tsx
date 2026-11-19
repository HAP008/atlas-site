/**
 * Behaviour tests for the waitlist form: every state from CLAUDE.md §8.
 * idle · submitting · success · error · not connected · honeypot tripped · unchecked 18+ box,
 * plus bad email, server-rejected email, rate limit, and "never logs the email".
 * fetch is always mocked. Fixture address: test@example.com only.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WaitlistForm } from "@/components/waitlist-form";

const ENDPOINT = "https://forms.test.invalid/f/abc123";
const EMAIL = "test@example.com";

let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

beforeEach(() => {
  fetchMock = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function setup(endpoint: string | null = ENDPOINT) {
  const user = userEvent.setup();
  render(<WaitlistForm endpoint={endpoint} />);
  return {
    user,
    email: () => screen.getByLabelText("Email address"),
    age: () => screen.getByRole("checkbox", { name: /18 or older/i }),
    submit: () => screen.getByRole("button", { name: /join the waitlist|joining/i }),
  };
}

async function fillValid(ctx: ReturnType<typeof setup>) {
  await ctx.user.type(ctx.email(), EMAIL);
  await ctx.user.click(ctx.age());
}

describe("WaitlistForm", () => {
  it("not connected: explains honestly and offers email instead of a form", () => {
    setup(null);
    expect(screen.getByText(/isn.t connected yet/i)).toBeInTheDocument();
    expect(screen.queryByLabelText("Email address")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "huzaifapardiwala@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:huzaifapardiwala@gmail.com",
    );
  });

  it("idle: labelled email, 18+ checkbox, Privacy and Terms links, submit button", () => {
    const ctx = setup();
    expect(ctx.email()).toHaveAttribute("type", "email");
    expect(ctx.email()).toHaveAttribute("autocomplete", "email");
    expect(ctx.age()).not.toBeChecked();
    // Exact built hrefs (base path + trailing slash) are checked by scripts/check-export.ts.
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", expect.stringMatching(/\/privacy\/?$/));
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", expect.stringMatching(/\/terms\/?$/));
    expect(ctx.submit()).toHaveTextContent("Join the waitlist");
  });

  it("keyboard: Tab goes email → 18+ box → Terms → Privacy → submit, skipping the honeypot; Space ticks the box", async () => {
    const ctx = setup();
    await ctx.user.tab();
    expect(ctx.email()).toHaveFocus();
    await ctx.user.tab();
    expect(ctx.age()).toHaveFocus();
    await ctx.user.keyboard(" ");
    expect(ctx.age()).toBeChecked();
    await ctx.user.tab();
    expect(screen.getByRole("link", { name: "Terms" })).toHaveFocus();
    await ctx.user.tab();
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveFocus();
    await ctx.user.tab();
    expect(ctx.submit()).toHaveFocus();
  });

  it("without JavaScript, a native submit POSTs to the form service, never a GET to our own page", () => {
    setup();
    const form = screen.getByRole("form");
    expect(form).toHaveAttribute("method", "post");
    expect(form).toHaveAttribute("action", ENDPOINT);
  });

  it("before JavaScript runs, the browser itself enforces the email and the 18+ box", () => {
    // What the static export ships: no novalidate, both fields required.
    const html = renderToString(<WaitlistForm endpoint={ENDPOINT} />);
    expect(html).not.toMatch(/novalidate/i);
    const doc = new DOMParser().parseFromString(html, "text/html");
    const form = doc.querySelector("form");
    expect(form?.noValidate).toBe(false);
    expect(doc.querySelector<HTMLInputElement>('input[type="email"]')?.required).toBe(true);
    const box = doc.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(box?.required).toBe(true);
    expect(box?.value).toBe("yes");
    expect(form?.checkValidity()).toBe(false);
  });

  it("once JavaScript runs, it takes over validation so our own messages show", () => {
    setup();
    expect((screen.getByRole("form") as HTMLFormElement).noValidate).toBe(true);
  });

  it("the field is already marked invalid, with its error, at the moment it receives focus", async () => {
    const ctx = setup();
    const atFocus: { invalid: string | null; describedBy: string | null; errorInDom: boolean }[] = [];
    ctx.age().addEventListener("focus", (e) => {
      const el = e.currentTarget as HTMLElement;
      const describedBy = el.getAttribute("aria-describedby");
      atFocus.push({
        invalid: el.getAttribute("aria-invalid"),
        describedBy,
        errorInDom: !!(describedBy && document.getElementById(describedBy)),
      });
    });
    await ctx.user.type(ctx.email(), EMAIL);
    await ctx.user.click(ctx.submit());
    expect(atFocus.at(-1)).toEqual({ invalid: "true", describedBy: expect.any(String), errorInDom: true });
  });

  it("unchecked 18+ box: blocks the submit, explains why, focuses the checkbox", async () => {
    const ctx = setup();
    await ctx.user.type(ctx.email(), EMAIL);
    await ctx.user.click(ctx.submit());

    expect(screen.getByText(/confirm you.re 18 or older/i)).toBeInTheDocument();
    expect(ctx.age()).toHaveAttribute("aria-invalid", "true");
    expect(ctx.age()).toHaveAccessibleDescription(/18 or older/i);
    expect(ctx.age()).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("empty or malformed email: blocks the submit and points at the field", async () => {
    const ctx = setup();
    await ctx.user.click(ctx.age());
    await ctx.user.click(ctx.submit());
    expect(ctx.email()).toHaveAccessibleDescription("Enter your email address.");
    expect(ctx.email()).toHaveFocus();

    await ctx.user.type(ctx.email(), "test@example");
    await ctx.user.click(ctx.submit());
    expect(ctx.email()).toHaveAccessibleDescription(/doesn.t look like an email address/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submitting: shows progress and ignores double submits", async () => {
    let resolve: (r: Response) => void = () => {};
    fetchMock.mockReturnValue(new Promise<Response>((r) => (resolve = r)));
    const ctx = setup();
    await fillValid(ctx);
    await ctx.user.click(ctx.submit());

    expect(ctx.submit()).toHaveTextContent("Joining…");
    expect(ctx.submit()).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("form")).toHaveAttribute("aria-busy", "true");
    await ctx.user.click(ctx.submit());
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolve(new Response("{}", { status: 200 }));
    expect(await screen.findByText("You're on the waitlist.")).toBeInTheDocument();
  });

  it("success: confirms in the page's own words, without a reload, and moves focus there", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const ctx = setup();
    await fillValid(ctx);
    await ctx.user.click(ctx.submit());

    const heading = await screen.findByText("You're on the waitlist.");
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.getByText(/delete it within 30 days/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(ENDPOINT);
    expect((fetchMock.mock.calls[0][1]?.body as URLSearchParams).get("email")).toBe(EMAIL);
  });

  it("error: says what went wrong and what to do, and keeps the typed email", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const ctx = setup();
    await fillValid(ctx);
    await ctx.user.click(ctx.submit());

    const alert = await screen.findByRole("alert");
    await waitFor(() => expect(alert).toHaveTextContent(/didn.t go through/i));
    expect(alert).toHaveTextContent("huzaifapardiwala@gmail.com");
    expect(ctx.email()).toHaveValue(EMAIL);
    expect(ctx.submit()).toHaveTextContent("Join the waitlist");
  });

  it("server rejects the address: shows it on the email field", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 422 }));
    const ctx = setup();
    await fillValid(ctx);
    await ctx.user.click(ctx.submit());
    await waitFor(() => expect(ctx.email()).toHaveAccessibleDescription(/didn.t accept that email/i));
  });

  it("rate limited: asks the visitor to wait", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 429 }));
    const ctx = setup();
    await fillValid(ctx);
    await ctx.user.click(ctx.submit());
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/wait a minute/i));
  });

  it("honeypot tripped: shows success but sends nothing", async () => {
    const ctx = setup();
    const honeypot = document.querySelector<HTMLInputElement>('input[name="_gotcha"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("data-1p-ignore");
    expect(honeypot).toHaveAttribute("data-lpignore", "true");
    expect(honeypot?.id).not.toMatch(/website|url|name|email/i);
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();

    honeypot!.value = "https://spam.test.invalid";
    await fillValid(ctx);
    await ctx.user.click(ctx.submit());

    expect(await screen.findByText("You're on the waitlist.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never writes the email address to the console", async () => {
    const spies = (["log", "info", "warn", "error", "debug"] as const).map((m) =>
      vi.spyOn(console, m).mockImplementation(() => {}),
    );
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const ctx = setup();
    await fillValid(ctx);
    await ctx.user.click(ctx.submit());
    await screen.findByText(/didn.t go through/i);

    for (const spy of spies) {
      for (const call of spy.mock.calls) {
        expect(JSON.stringify(call)).not.toContain(EMAIL);
      }
    }
  });
});
