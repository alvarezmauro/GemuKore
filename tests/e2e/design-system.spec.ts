import { expect, test } from "@playwright/test";

test("form feedback is associated with fields and examples remain unsaved", async ({
  page,
}) => {
  await page.goto("/design-preview");
  const name = page.getByRole("textbox", { name: "Name (required)" });
  const notes = page.getByRole("textbox", { name: "Notes", exact: true });
  await page.getByRole("button", { name: "Check example" }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAccessibleDescription(/Enter a name/);
  await name.fill("My sample game");
  await notes.fill("x".repeat(301));
  await page.getByRole("button", { name: "Check example" }).click();
  await expect(notes).toHaveAccessibleDescription(/300 characters or fewer/);
  await notes.fill("An illustrative note");
  await page.getByRole("button", { name: "Check example" }).click();
  await expect(
    page.getByText("Preview complete. Nothing has been saved."),
  ).toBeVisible();
  await expect(name).toHaveAttribute("aria-invalid", "false");
  await expect(notes).toHaveValue("An illustrative note");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(name).toHaveValue("");
  await expect(notes).toHaveValue("");
  await expect(
    page.getByText("Preview complete. Nothing has been saved."),
  ).toHaveCount(0);
  await name.fill("Temporary example");
  await page.reload();
  await expect(name).toHaveValue("");
});

test("compact navigation traps focus, closes with Escape and closes after navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/design-preview");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  const icon = trigger.locator("svg");
  await expect(icon).toHaveAttribute("data-state", "closed");
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "GemuKore" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("animation-name", "none");
  const close = dialog.getByRole("button", { name: "Close", exact: true });
  await expect(close.locator("svg")).toHaveAttribute("data-state", "open");
  await expect(close.locator("svg")).toHaveCSS("transition-duration", "0s");
  await expect(close.locator("path").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
  // Radix deliberately focuses the close control rather than a navigation link.
  await expect(
    dialog.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("link", { name: "Overview" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(icon).toHaveAttribute("data-state", "closed");
  await trigger.click();
  await close.click();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Forms", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/#forms$/);
  await expect(
    page.getByRole("heading", { name: "Simple, readable forms" }),
  ).toBeInViewport();
});

test("dock expands over the page, keeps its state and supports both toggle controls", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/design-preview");
  const rail = page.getByRole("complementary", { name: "Workspace sidebar" });
  const trigger = rail.getByRole("button", { name: "Workspace menu" });
  const icon = trigger.locator("svg");
  const outerLine = icon.locator("path").first();
  const navigation = rail.getByRole("navigation", { name: "Main navigation" });
  const forms = navigation.getByRole("link", { name: "Forms", exact: true });
  const bodyBefore = await page.locator(".workspace-body").boundingBox();
  const railBefore = await rail.boundingBox();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(rail).toHaveCSS("width", "72px");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(icon).toHaveCSS("transition-duration", "0.6s");
  await expect(icon).toHaveCSS(
    "transition-timing-function",
    "cubic-bezier(0.4, 0, 0.2, 1)",
  );
  await expect(forms.locator(".rail-link-title")).toBeHidden();
  await forms.hover();
  await expect(forms.locator(".rail-link-label")).toHaveCSS("opacity", "1");
  await expect(forms.locator(".rail-link-highlight")).toHaveCSS("opacity", "1");
  await expect(rail).toHaveCSS("width", "72px");
  await page.screenshot({ path: info.outputPath("dock-collapsed.png") });

  await rail
    .getByRole("button", { name: "Expand sidebar", exact: true })
    .click();
  await expect(rail).toHaveCSS("width", "240px");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(icon).toHaveCSS(
    "transform",
    "matrix(0.707107, -0.707107, 0.707107, 0.707107, 0, 0)",
  );
  await expect(outerLine).toHaveCSS("stroke-dasharray", "20px, 300px");
  await expect(outerLine).toHaveCSS("stroke-dashoffset", "-32.42px");
  await expect(forms.locator(".rail-link-title")).toHaveCSS("opacity", "1");
  await forms.hover();
  await expect(forms.locator(".rail-link-label")).toHaveCSS("opacity", "0");
  // Expanding is an overlay: page content and the rail's anchor do not move.
  expect(await page.locator(".workspace-body").boundingBox()).toEqual(
    bodyBefore,
  );
  const railAfter = await rail.boundingBox();
  expect(railAfter?.x).toBe(railBefore?.x);
  expect(railAfter?.y).toBe(railBefore?.y);
  expect(railAfter?.height).toBe(railBefore?.height);
  await expect(page.getByRole("menu", { name: "Workspace menu" })).toHaveCount(
    0,
  );
  await page.screenshot({ path: info.outputPath("dock-expanded.png") });
  // This is a pinned dock, so clicking outside leaves the chosen state intact.
  await page
    .getByRole("heading", { name: "GemuKore", level: 1, exact: true })
    .click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await forms.click();
  await expect(page).toHaveURL(/#forms$/);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.click();
  await expect(rail).toHaveCSS("width", "72px");
  await trigger.click();
  await rail
    .getByRole("button", { name: "Collapse sidebar", exact: true })
    .click();
  await expect(rail).toHaveCSS("width", "72px");
  await expect(icon).toHaveAttribute("data-state", "closed");
  expect(errors).toEqual([]);
});

test("dock supports keyboard focus, interrupted toggles, live reduced motion and desktop resizing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/design-preview");
  const rail = page.getByRole("complementary", { name: "Workspace sidebar" });
  const trigger = rail.getByRole("button", { name: "Workspace menu" });
  const icon = trigger.locator("svg");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    rail.getByRole("link", { name: "Overview", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  // Toggle during the spring, then change the system preference in flight.
  await trigger.click();
  await trigger.click();
  await trigger.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(rail).toHaveCSS("width", "240px");
  await expect(rail.locator(".rail-heading-label")).toHaveCSS("opacity", "1");
  await expect(rail.locator(".rail-link-title").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(icon).toHaveCSS("transition-duration", "0s");
  await expect(icon.locator("path").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await trigger.click();
  await expect(rail).toHaveCSS("width", "72px");
  await expect(rail.locator(".rail-heading-label")).toHaveCSS("opacity", "0");
  await expect(rail.locator(".rail-link-title").first()).toHaveCSS(
    "opacity",
    "0",
  );
  const forms = rail.getByRole("link", { name: "Forms", exact: true });
  await forms.focus();
  await expect(forms.locator(".rail-link-label")).toHaveCSS("opacity", "1");
  await expect(forms.locator(".rail-link-label")).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await trigger.click();
  await page.setViewportSize({ width: 640, height: 700 });
  await expect(rail).toBeHidden();
  await expect(page.getByRole("main")).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(rail).toHaveCSS("width", "72px");
  await expect(icon).toHaveAttribute("data-state", "closed");
});

test("small screens and zoom-sized layouts stay usable in both themes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/design-preview");
  for (const theme of ["Light", "Dark"] as const) {
    await page.getByRole("button", { name: "Choose theme" }).click();
    await page.getByRole("menuitemradio", { name: theme, exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("heading", { level: 1, name: "GemuKore" }),
    ).toBeVisible();
    await expect(page.locator('[data-slot="skeleton"]').first()).toHaveCSS(
      "animation-name",
      "none",
    );
  }
  // A 1280px desktop at 200% zoom has an effective 640px CSS viewport.
  await page.setViewportSize({ width: 640, height: 480 });
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Control+Home");
});

test("the skip link moves keyboard focus to the main content", async ({
  page,
}) => {
  await page.goto("/design-preview");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("open mobile navigation closes at the desktop breakpoint and releases focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 700 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/design-preview");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const sheet = page.getByRole("dialog", { name: "GemuKore" });
  await expect(sheet).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 700 });
  await expect(sheet).toHaveCount(0);
  await expect(trigger).toBeHidden();
  await expect(page.getByRole("main")).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("pointer-events", "none");
  await page.getByRole("button", { name: "Choose theme" }).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 640, height: 700 });
  await expect(trigger).toBeVisible();
  await expect(sheet).toHaveCount(0);
  await trigger.click();
  await expect(sheet).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("card identity and copy metadata wrap instead of being clipped at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/design-preview");
  const card = page.locator('#cards [data-slot="card"]').first();
  // Stress the existing rendered component with deterministic display values;
  // this does not add a product route, fixture catalog or persistence.
  await card.evaluate((element) => {
    for (const selector of ["h3", "h3 + p", "dt", "dd"]) {
      element.querySelector(selector)!.textContent = "ReleaseIdentifier".repeat(
        20,
      );
    }
  });
  for (const theme of ["Light", "Dark"] as const) {
    await page.getByRole("button", { name: "Choose theme" }).click();
    await page.getByRole("menuitemradio", { name: theme, exact: true }).click();
    for (const selector of ["h3", "h3 + p", "dt", "dd"]) {
      const text = card.locator(selector).first();
      expect(
        await text.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
    }
    expect(
      await card.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
