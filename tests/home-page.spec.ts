import test from "@/fixtures";
import { expect } from "@playwright/test";
import homepageElementData from "@datasets/homepage-element.dataset.json";
import searchProductsData from "@datasets/search-products.dataset.json";

test("TC_01: Verify Homepage Elements Are Visible", async ({ homePage }) => {
  // 1. Navigate to https://demo.testarchitect.com/
  await homePage.goto();

  // 2. Close popup notifications
  await homePage.closeSalesPopupIfVisible();

  // 3. Accept cookie notice
  await homePage.acceptCookiesIfVisible();

  // 4. Verify header section elements:
  expect
    .soft(await homePage.getPhoneNumberText())
    .toContain(homepageElementData.phoneNumber);
  expect
    .soft(await homePage.getAddressText())
    .toContain(homepageElementData.address);

  // 5. Verify top navigation elements:
  //    - Login/Sign up link
  expect.soft(await homePage.isLoginOrSignupButtonVisible()).toBeTruthy();
  expect.soft(await homePage.isLoginOrSignupButtonClickable()).toBeTruthy();

  //    - Social media icons
  for (const social of homepageElementData.socialMedias) {
    expect.soft(await homePage.isSocailLinkVisible(social)).toBeTruthy();
    expect.soft(await homePage.isSocailLinkClickable(social)).toBeTruthy();
  }

  // 6. Verify main navigation menu:
  for (const menuItem of homepageElementData.navigationMenuItems) {
    expect.soft(await homePage.isMainMenuItemVisible(menuItem)).toBeTruthy();
    expect.soft(await homePage.isMainMenuItemClickable(menuItem)).toBeTruthy();
  }
});
