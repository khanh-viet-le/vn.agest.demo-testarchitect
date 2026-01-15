import test from "@/fixtures";
import { IOrderInfo } from "@/src/interfaces/order-info.interface";
import { expect } from "@playwright/test";
import { getDataset } from "@utils/data-helper";

const orderInfoList = getDataset<IOrderInfo>("order-info");

// Products in cart
test.beforeEach(async ({ shopPage, homePage }) => {
  await shopPage.goto();
  await homePage.closeSalesPopupIfVisible();
  await homePage.acceptCookiesIfVisible();

  const productPage = await shopPage.selectFirstAvailableProduct();
  await productPage.addToCart();
});

test.describe("TC_08: Verify Guest User Can Complete Checkout", async () => {
  for (const orderInfo of orderInfoList) {
    test(`Guest User '${orderInfo.billingInfo.firstName} ${orderInfo.billingInfo.lassName}' Can Complete Checkout`, async ({
      cartPage,
    }) => {
      // 1. Navigate to Cart
      await cartPage.goto();

      // 2. Click "Proceed to Checkout"
      const checkoutPage = await cartPage.proceedToCheckout();

      // 3. Fill in billing details:
      // 4. Select payment method
      // 5. Place order
      await checkoutPage.placeOrder(orderInfo);

      // - Order should be placed successfully
      //   expect.soft(await checkoutPage.isOrderPlaced()).toBeTruthy();

      // - Order confirmation should be displayed

      // - Order number should be generated
      expect.soft(await checkoutPage.getOrderNumber()).toBeGreaterThan(0);
    });
  }
});
