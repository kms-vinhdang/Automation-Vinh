import { Page, expect, test } from "@playwright/test";
test.describe("Hook group for OrangeHRM Login Tests", () => {
    let page: Page;
    let username: string;
    let password: string;

    // Function to generate a random string for Username
    function generateRandomUsername(length: number) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto(
            "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
        );
        await page.locator("input[name='username']").fill("Admin");
        await page.locator("input[name='password']").fill("admin123");
        await page.locator("button:has-text('Login')").click();
        await page.waitForTimeout(1000);

        // Verify that the Dashboard page is displayed
        await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
        await page.locator("a:has-text('Admin')").click();
        await page.locator("button:has-text('Add')").click();

        // User role Admin
        await page.locator("//div[(.)='User Role']/following-sibling::div//div[text()='-- Select --']").click();
        await page.locator("//div[@role='option']/span[text()='Admin']").click();
        await page.waitForTimeout(1000);

        // Select Status Enabled
        await page.locator("//label[text() = 'Status']//..//following-sibling::div//i").click()
        await page.locator("//div[@role = 'option']//span[text() = 'Enabled']").click();

        // Type Emplopyee Name
        await page.waitForTimeout(1000);
        await page.locator("//label[text() = 'Employee Name']//..//following-sibling::div//input").type("n");
        await page.waitForTimeout(1000);
        await page.waitForSelector('//div[@role="listbox" and contains(@class, "oxd-autocomplete-dropdown")]', { timeout: 20000 });
        await page.waitForTimeout(1000);
        await page.locator('//div[@role="listbox" and contains(@class, "oxd-autocomplete-dropdown")]').click();
        await page.waitForTimeout(1000);

        // Input Username with random value
        // Generate a random username
        username = generateRandomUsername(5);
        await page.locator("//label[text() = 'Username']//..//following-sibling::div//input").fill(username);

        // Input password
        await page.locator("//label[text() = 'Password']//..//following-sibling::div//input").fill("trinh123");
        
        // Input Confirm Passrod 
        await page.locator("//label[text() = 'Confirm Password']//..//following-sibling::div//input").fill("trinh123");

        // click save button
        await page.locator("//button[normalize-space(.) = 'Save']").click();
        await page.waitForURL("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");

        // store created user
        password = "trinh123"
        // });
    });

    test.afterAll(async () => {
        if (page && !page.isClosed()) {
            await page.locator('span.oxd-userdropdown-tab').click();
            await page.locator('a.oxd-userdropdown-link').click();
            await page.close();
        }
    });

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    });

    test.afterEach(async () => {
        await test.step("After each test: Close the page", async () => {
            await page.close();
        });
    });


    // Test Case 01:  Verify that the user can log in successfully when provided the username and password correctly
    test("TC01: User can log in successfully when provided the username and password correctly", async () => {
        // Input valid credentials for the account created at pre-condition
        await test.step("Step 1: Input valid credentials for the account created at pre-condition", async () => {
            await page.locator("input[name='username']").fill(username);
            await page.locator("input[name='password']").fill(password);
        });
        // Click the Login button
        await test.step("Step 2: Click on Login button", async () => {
            await page.locator("button:has-text('Login')").click();
        });
        await page.waitForTimeout(2000);
        // Verify that the Dashboard page is displayed
        await test.step("Step 3: Verify that the Dashboard page is displayed", async () => {
            await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
        });
        await page.waitForTimeout(2000);

    });
    // Test Case 02: Verify that the user can not log in successfully when providing username is empty
    test("TC02: User can not log in successfully when providing username is empty", async () => {
        // Leave the username with a blank value
        await test.step("Step 1: Leave the username with a blank value", async () => {
            await page.locator("input[name='username']").fill("");
        });

        // Input the valid password
        await test.step("Step 2: Input the valid password", async () => {
            console.log('Password:', password);
            await page.locator("input[name='password']").fill(password);
        });
        // Click the Login button
        await test.step("Step 3: Click on Login button", async () => {
            await page.locator("button:has-text('Login')").click();
        });
        await page.waitForTimeout(2000);
        // Verify that the “Required” message is displayed below the username textbox
        await test.step("Step 4: Verify that the “Required” message is displayed below the username textbox", async () => {
            await expect(page.locator(":text-is('Required')")).toBeVisible();
        });
        await page.waitForTimeout(2000);
    })
})