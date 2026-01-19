import addedToCartTest from "@fixtures/add-to-cart.fixture";
import { IOrderInfo } from "@interfaces/order-info.interface";
import { CartPage } from "@pages/cart.page";
import { CheckoutPage } from "@pages/checkout.page";
import { expect } from "@playwright/test";
import { DataHelper } from "@utils/data-helper.util";

const orderInfoList = DataHelper.getDataset<IOrderInfo>("order-info");

// Products in cart
const test = addedToCartTest;

test.describe("TC_08: Verify Guest User Can Complete Checkout", async () => {
  for (const orderInfo of orderInfoList) {
    test(`Guest User '${orderInfo.billingInfo.firstName} ${orderInfo.billingInfo.lassName}' Can Complete Checkout`, async ({
      productPage,
      page,
    }) => {
      // 1. Navigate to Cart
      await productPage.navigateToCartPage();

      // 2. Click "Proceed to Checkout"
      const cartPage = new CartPage(page);
      await cartPage.proceedToCheckout();

      // 3. Fill in billing details:
      // 4. Select payment method
      // 5. Place order
      const checkoutPage = new CheckoutPage(page);
      await checkoutPage.placeOrder(orderInfo);

      // - Order should be placed successfully ?

      // - Order confirmation should be displayed ?

      // - Order number should be generated
      expect.soft(await checkoutPage.getOrderNumber()).toBeGreaterThan(0);
    });
  }
});
