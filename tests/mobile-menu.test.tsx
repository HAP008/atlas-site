/**
 * MobileMenu behaviour: closes on link tap, on Escape (focus back on the button) and
 * when keyboard focus leaves it. next/navigation is mocked; no real navigation happens.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MobileMenu } from "@/components/mobile-menu";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const LINKS = [
  { href: "/features/", label: "Features" },
  { href: "/pricing/", label: "Pricing" },
];

// jsdom can't navigate; stop link clicks from trying.
const stopNavigation = (e: MouseEvent) => {
  if (e.target instanceof Element && e.target.closest("a")) e.preventDefault();
};
beforeEach(() => document.addEventListener("click", stopNavigation));
afterEach(() => document.removeEventListener("click", stopNavigation));

function setup() {
  const user = userEvent.setup();
  render(
    <div>
      <MobileMenu links={LINKS} />
      <button type="button">After the menu</button>
    </div>,
  );
  const details = document.querySelector("details") as HTMLDetailsElement;
  const summary = details.querySelector("summary") as HTMLElement;
  details.open = true;
  return { user, details, summary };
}

describe("MobileMenu", () => {
  it("closes when a link is chosen", async () => {
    const { user, details } = setup();
    await user.click(screen.getByRole("link", { name: "Pricing" }));
    expect(details.open).toBe(false);
  });

  it("closes on Escape and returns focus to the menu button", () => {
    const { details, summary } = setup();
    screen.getByRole("link", { name: "Features" }).focus();
    fireEvent.keyDown(details, { key: "Escape" });
    expect(details.open).toBe(false);
    expect(summary).toHaveFocus();
  });

  it("closes when keyboard focus moves outside the menu", () => {
    const { details } = setup();
    const lastLink = screen.getByRole("link", { name: "Pricing" });
    const outside = screen.getByRole("button", { name: "After the menu" });
    fireEvent.blur(lastLink, { relatedTarget: outside });
    expect(details.open).toBe(false);
  });

  it("stays open while focus moves between its own links", () => {
    const { details } = setup();
    fireEvent.blur(screen.getByRole("link", { name: "Features" }), {
      relatedTarget: screen.getByRole("link", { name: "Pricing" }),
    });
    expect(details.open).toBe(true);
  });
});
