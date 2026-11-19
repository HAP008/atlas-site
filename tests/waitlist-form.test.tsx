/**
 * Behaviour tests for the waitlist form: every state from CLAUDE.md §8.
 * idle · submitting · success · error · not connected · honeypot tripped · unchecked 18+ box,
 * plus bad email, server-rejected email, rate limit, and "never logs the email".
 * fetch is always mocked. Fixture address: test@example.com only.
 */

import { render, screen, waitFor } from "@testing-library/react";
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
