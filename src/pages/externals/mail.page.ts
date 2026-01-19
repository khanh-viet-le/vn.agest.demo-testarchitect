import { MailHostConstant } from "@constants/mail-host.constants";
import { RouteConstants } from "@constants/route.constants";
import { Locator, Page } from "@playwright/test";

export class MailPage {
  private readonly page: Page;
  readonly editMailButtonLocator: Locator;
  readonly mailInputLocator: Locator;
  readonly setMailButtonLocator: Locator;
  readonly mailInboxLinkLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editMailButtonLocator = this.page.locator("#inbox-id");
    this.mailInputLocator = this.editMailButtonLocator.getByRole("textbox");
    this.setMailButtonLocator = this.editMailButtonLocator.getByRole("button", {
      name: "Set",
    });
    this.mailInboxLinkLocator = this.page
      .locator("#email_list")
      .locator(".td3");
  }

  async goto() {
    await this.page.goto(RouteConstants.MAIL_HOST);
  }

  async setMail(email: string) {
    email = email.split("@").shift() ?? "";

    if (!email) {
      throw new Error("Invalid mail name");
    }

    await this.editMailButtonLocator.waitFor({ state: "visible" });
    await this.editMailButtonLocator.click();
    await this.mailInputLocator.waitFor({ state: "visible" });
    await this.mailInputLocator.fill(email);
    await this.setMailButtonLocator.click();
  }

  async localeToMailInbox(title: string) {
    await this.mailInboxLinkLocator
      .filter({
        hasText: new RegExp(title, "i"),
      })
      .first()
      .click({ timeout: 60_000 });
  }

  getLinkInMail(name: string) {
    return this.page.getByText(new RegExp(name, "i"));
  }

  async navigateToLinkInMail(name: string): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page", {
        timeout: 60_000,
      }),
      this.getLinkInMail(name).click({ timeout: 60_000 }),
    ]);

    await newPage.waitForLoadState("domcontentloaded", {
      timeout: 60_000,
    });
    return newPage;
  }
}
