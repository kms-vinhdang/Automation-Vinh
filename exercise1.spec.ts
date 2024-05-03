import { expect, test } from "@playwright/test";
test("Test 1: buy the iphone 13 PRO successfully", async ({ page }) => {
  await test.step("step 1: go to rahulshettyacadem Login page", async () => {
    // Navigate to the website rahulshettyacade
    await page.goto("https://rahulshettyacademy.com/client");
  });
  await test.step("Step 2: Enter valid Email and Password", async () => {
    // Login with valid Email and Password
    await page.locator("input[id='userEmail']").fill("rahulshetty@gmail.com");
    await page.locator("input[id='userPassword']").fill("Iamking@000");
  });
  await test.step("Step 3: Click on Login button", async () => {
    // Click button Login successfully
    await page.locator("input[id='login']").click();
  });

  await test.step("Step 4: Verify that user is logged in successfully", async () => {
    // Check login successfully
    await expect(page).toHaveURL("https://rahulshettyacademy.com/client/dashboard/dash");
  });

  await test.step("Step 5: Click on “Add to Cart” for iPhone 13 PRO item", async () => {
    // click to Add iphone 13 Pro to cart 
    await page.locator('div.card-body:has(h5:has-text("IPHONE 13 PRO")) button.btn.w-10.rounded:has-text("Add To Cart")').click();
  });

  await test.step("Step 6: Go to the Cart page by clicking on the Cart button", async () => {
    // click to cart button 
    await page.locator('button.btn.btn-custom:has-text("Cart")').click();
  });

  await test.step("Step 7: Click on “Check out” button", async () => {
    // click to checkout button successfully
    await page.locator('button.btn.btn-primary:has-text("Checkout")').click();
  });

  await test.step("Step 8: Select country", async () => {

    // Fill in the input field with "Bolivia"
    await page.locator('input[placeholder="Select Country"]').type('Bolivia');

    // Click on the suggestion item for "Bolivia"
    await page.waitForSelector('span.ng-star-inserted:has-text("Bolivia")', { timeout: 20000 });
    await page.locator('span.ng-star-inserted:has-text("Bolivia")').click();

  });

  await test.step("Step 9: Click on “Place Order", async () => {
    // Click Place Order button successfully 
    await page.locator('.btnn.action__submit').click();
  });

  await test.step("Step 10: Get Order ID", async () => {
    // wait orderId appear
    await page.waitForSelector('label.ng-star-inserted', { timeout: 20000 });
    // Get text content for orderId
    const orderId = await page.textContent('label.ng-star-inserted');
    if (orderId !== null) {
      // Remove and trim special characters from the order ID
      const trimmedOrderId = orderId.replace(/\|/g, '').trim();
      // Log OrderId 
      console.log('OrderId:', trimmedOrderId);
      return true;
    } else {
      console.error('OrderId is null!');
      return false;
    }
  });

  await test.step("Step 11: Verify Order ID", async () => {
    // Get the orderId from Step 9
    const orderIdStep10 = await page.textContent('label.ng-star-inserted');

    // Navigate to the Your Orders page by locator Orders button
    await page.locator('button.btn.btn-custom[routerlink="/dashboard/myorders"]').click();

    // Get the orderId from the Your Orders page
    await page.waitForSelector('th[scope="row"]');
    const orderIdonYourOrders = await page.textContent('th[scope="row"]');

    // Check if order ID step 10 and OrderId on your orders  are not null
    if (orderIdStep10 !== null && orderIdonYourOrders !== null) {
      // Replace and trim  special characters from the OrderId step 10 and your orders
      const trimmedOrderIdStep10 = orderIdStep10.replace(/\|/g, '').trim();
      const trimmedOrderIdonYourOrders = orderIdonYourOrders.replace(/\|/g, '').trim();
      // Log OrderId from step 10 after trim and replace
      console.log('OrderId from Step 10:', trimmedOrderIdStep10);
      // Log OrderId on your ordes after trim and replace
      console.log('OrderId on Your Orders page:', trimmedOrderIdonYourOrders);

      // Compare the orderId from step 10 and orderId on your orders
      if (trimmedOrderIdStep10 === trimmedOrderIdonYourOrders) {
        console.log('OrderId match.');
        return true;
      } else {
        console.error('OrderId do not match!');
        return false;
      }
    } else {
      console.error('One or both orderId are null!!');
      return false;
    }
  });

})