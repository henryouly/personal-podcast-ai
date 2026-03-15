import { auth } from "../src/lib/auth";
import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = "test@example.com";
  const password = "password123";
  const name = "Test User";

  console.log(`Creating test user: ${email}...`);

  try {
    // Use BetterAuth to create the user (this handles password hashing and internal tables)
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    console.log("User created successfully via BetterAuth!");

    // Update the user record with an RSS token (BetterAuth doesn't know about our custom fields by default)
    await db.update(users).set({ rssToken: "test-token-xyz-123" }).where(eq(users.email, email));

    console.log("RSS Token assigned: test-token-xyz-123");
    console.log("\n--- Login Credentials ---");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("-------------------------\n");
  } catch (error) {
    console.error("Failed to create user:", error);
  } finally {
    process.exit();
  }
}

main();
