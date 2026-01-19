import commonFixture from "@fixtures/common.fixture";
import { DataHelper } from "@utils/data-helper.util";
import { expect } from "@playwright/test";
import { RegisterPage } from "@pages/register.page";
import { MyAccountPage } from "@pages/my-account.page";
import { MailPage } from "@pages/externals/mail.page";
import { SetPasswordPage } from "@pages/set-password.page";
import { HomePage } from "@pages/home.page";
import { LoginPage } from "@pages/login.page";
import { MailHostConstant } from "@constants/mail-host.constants";

const test = commonFixture;

const prefixTimestamp = new Date().getTime();
const testEmail = `test.${prefixTimestamp}@${MailHostConstant.ACTIVE_MAIL_HOST}`;

const receivedMailTitle =
  "Your TestArchitect Sample Website account has been created";
const setPasswordLink = "Click here to set your new password";

test("TC_09: Verify New User Can Register Successfully", async ({
  homePage,
  page,
  context,
}) => {
  // 1. Click "Log in / Sign up" link
  await homePage.navigateToAccountPage();
  const registerPage = new RegisterPage(page);

  // 2. Locate the registration form
  // 3. Enter a valid email address
  // 4. Click the "Register" button
  await registerPage.register(testEmail);
  let myAccountPage = new MyAccountPage(page);

  // 5. Verify that the account is created successfully
  // - Registration completes successfully
  // - User is automatically logged in after registration
  const username = testEmail.split("@").shift() ?? "";
  expect.soft(await myAccountPage.getUsername()).toMatch(new RegExp(username));

  // - My Account dashboard is displayed
  expect.soft(await myAccountPage.getTitle()).toMatch(/My Account/);

  // 6. Check the user’s email for a password set link
  const mailPage = new MailPage(await context.newPage());
  await mailPage.goto();
  await mailPage.setMail(username);
  await mailPage.localeToMailInbox(receivedMailTitle);

  // - Password set email is received by the user
  expect.soft(mailPage.getLinkInMail(setPasswordLink)).toBeVisible();

  // 7. Use the link to set a password
  const setPasswordPage = new SetPasswordPage(
    await mailPage.navigateToLinkInMail(setPasswordLink)
  );
  const password = username;
  await setPasswordPage.setPassword(password);

  // 8. Verify the user can log in with the newly created account
  const newPage = await context.newPage();
  homePage = new HomePage(newPage);
  await homePage.goto();
  await homePage.closeSalesPopupIfVisible();
  await homePage.acceptCookiesIfVisible();
  await homePage.navigateToAccountPage();

  const loginPage = new LoginPage(newPage);
  await loginPage.login(testEmail, password);
  myAccountPage = new MyAccountPage(newPage);

  // - User can log in using the newly set password
  expect.soft(await myAccountPage.getUsername()).toMatch(new RegExp(username));
});
