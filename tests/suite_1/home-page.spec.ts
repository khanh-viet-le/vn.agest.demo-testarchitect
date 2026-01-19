import test from "@fixtures/common.fixture";
import { expect } from "@playwright/test";
import homepageElementData from "@datasets/homepage-element.dataset.json";

test("TC_01: Verify Homepage Elements Are Visible", async ({ homePage }) => {
  // 1. Navigate to https://demo.testarchitect.com/
  // 2. Close popup notifications
  // 3. Accept cookie notice
  // 4. Verify header section elements:
  expect
    .soft(homePage.contactNumberTextLocator)
    .toContainText(homepageElementData.phoneNumber);

  expect
    .soft(homePage.addressTextLocator)
    .toContainText(homepageElementData.address);

  // 5. Verify top navigation elements:
  //    - Login/Sign up link
  expect.soft(homePage.loginOrSignupButtonLocator).toBeVisible();
  expect.soft(homePage.loginOrSignupButtonLocator).toBeEnabled();

  //    - Social media icons
  for (const social of homepageElementData.socialMedias) {
    const socailLinkLocator = homePage.getSocailLinkLocatorByName(social);
    expect.soft(socailLinkLocator).toBeVisible();
    expect.soft(socailLinkLocator).toBeEnabled();
  }

  // 6. Verify main navigation menu:
  for (const menuItem of homepageElementData.navigationMenuItems) {
    const menuItemLocator = homePage.getMainMenuItemLocatorByName(menuItem);
    expect.soft(menuItemLocator).toBeTruthy();
    expect.soft(menuItemLocator).toBeTruthy();
  }
});
