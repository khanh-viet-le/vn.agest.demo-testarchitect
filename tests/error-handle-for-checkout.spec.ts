import test from "@/fixtures";
import { IBillingInfoRequiredField } from "@interfaces/billing-info-required-field.interface";
import { IBillingInfo } from "@interfaces/billing-info.interface";
import { BillingInfo } from "@models/billing-info.model";
import { getDataset } from "@utils/data-helper";
import { expect } from "@playwright/test";

const billingInfoTest = {} as IBillingInfo;
const requiredBillingInfoFields = getDataset<IBillingInfoRequiredField>(
  "billing-info-required-fields"
).filter((field) => !field.defaultValue);

// User is at checkout
test.beforeEach(async ({ shopPage, homePage, checkoutPage }) => {
  await shopPage.goto();
  await homePage.closeSalesPopupIfVisible();
  await homePage.acceptCookiesIfVisible();

  const productPage = await shopPage.selectFirstAvailableProduct();
  await productPage.addToCart();

  await checkoutPage.goto();
});

test("TC_06: Verify Error Handling for Mandatory Checkout Fields", async ({
  checkoutPage,
}) => {
  // 1. Leave mandatory fields (address, payment info) blank
  // 2. Click 'Confirm Order'
  await checkoutPage.placeOrder(new BillingInfo(billingInfoTest));

  // 3. Verify error messages
  //   System should highlight missing fields and show an error message
  expect
    .soft(await checkoutPage.getMessages())
    .toHaveLength(requiredBillingInfoFields.length);

  for (const field of requiredBillingInfoFields) {
    expect
      .soft(await checkoutPage.isFieldHighlighted(field.fieldName))
      .toBeTruthy();
  }
});
