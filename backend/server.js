import admin from "firebase-admin";
import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";
import fs from "fs";
import express from "express";

// Load environment variables
dotenv.config();

// Read Firebase service account credentials
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore database reference
const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 5000;

// ThingsBoard Config
const TB_BASE_URL = process.env.TB_BASE_URL;
const TB_ADMIN_TOKEN = process.env.TB_ADMIN_TOKEN;
const CUSTOMER_ID = process.env.CUSTOMER_ID;
const TENANT_ID = process.env.TENANT_ID;

// For Debugging purposes
console.log("✅ Backend service started.");
console.log(`✅ Server running on port ${PORT}`);
console.log("✅ Firebase Admin SDK initialized.");
console.log("✅ ThingsBoard Config Loaded:", {
  TB_BASE_URL,
  CUSTOMER_ID,
  TENANT_ID,
});

// Function to create a user in ThingsBoard
async function createThingsBoardUser(email) {
  console.log(`🔹 Attempting to create ThingsBoard user for email: ${email}`);
  try {
    const userPayload = {
      email,
      authority: "CUSTOMER_USER",
      firstName: "User",
      lastName: "Auto",
      additionalInfo: { description: "Auto-generated user" },
      customerId: { id: CUSTOMER_ID, entityType: "CUSTOMER" },
      tenantId: { id: TENANT_ID, entityType: "TENANT" },
    };

    const response = await axios.post(`${TB_BASE_URL}/api/user`, userPayload, {
      headers: {
        "X-Authorization": `Bearer ${TB_ADMIN_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ User created successfully: ${response.data.id.id}`);
    return response.data.id.id;
  } catch (error) {
    console.error(
      "❌ Error creating ThingsBoard user:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Function to delete a user in ThingsBoard
async function deleteThingsBoardUser(userId) {
  console.log(`🔹 Attempting to delete ThingsBoard user: ${userId}`);
  try {
    await axios.delete(`${TB_BASE_URL}/api/user/${userId}`, {
      headers: { "X-Authorization": `Bearer ${TB_ADMIN_TOKEN}` },
    });
    console.log(`✅ User ${userId} deleted successfully.`);
  } catch (error) {
    console.error(
      "❌ Error deleting user:",
      error.response?.data || error.message
    );
  }
}

async function processBookings() {
  console.log("🔄 Checking for bookings to process...");

  const now = new Date();
  now.setSeconds(0, 0); // Normalize time
  console.log(`🕒 Current time: ${now.toISOString()}`);

  try {
    const snapshot = await db.collection("slots").get();

    if (snapshot.empty) {
      console.log("⚠️ No bookings found in Firestore!");
      return;
    }

    console.log(`📂 Found ${snapshot.size} bookings`);

    for (const doc of snapshot.docs) {
      const booking = doc.data();
      console.log(`📄 Booking Data [${doc.id}]:`, booking);

      // Convert date and slot into a Date object
      const [startHour, startMin] = booking.slot
        .split("-")[0]
        .split(":")
        .map(Number);
      const slotTime = new Date(booking.date);
      slotTime.setHours(startHour, startMin, 0, 0);

      // Check if this slot matches the current time
      if (slotTime.getTime() === now.getTime()) {
        console.log(`✅ Slot matched! Creating user for:`, booking);

        // Fetch email from users collection
        const userDoc = await db.collection("users").doc(booking.user).get();
        if (!userDoc.exists) {
          console.log(`⚠️ User ${booking.user} not found in users collection!`);
          continue;
        }

        const email = userDoc.data().email;
        console.log(`📧 Email found: ${email}`);

        const userId = await createThingsBoardUser(email);
        if (userId) {
          await db
            .collection("activeUsers")
            .doc(userId)
            .set({
              userId,
              email,
              expiry: new Date(slotTime.getTime() + 60 * 60 * 1000),
            });
          console.log(
            `✅ User created in ThingsBoard and saved to activeUsers`
          );
        }
      }
    }
  } catch (error) {
    console.error("❌ Firestore error:", error.message);
  }
}

async function cleanUpExpiredUsers() {
  console.log("🧹 Checking for expired users...");

  const now = new Date(); // Current server time
  console.log(`🕒 Current time: ${now.toISOString()}`);

  try {
    const slotsSnapshot = await db.collection("slots").get();
    let expiredUsers = new Set();

    slotsSnapshot.forEach((doc) => {
      const booking = doc.data();
      const bookingDate = new Date(booking.date); // Convert Firestore date to Date object
      const [startHour, startMin] = booking.slot.split("-")[0].split(":"); // Extract slot start time

      // Adjust booking date with slot start time
      bookingDate.setHours(parseInt(startHour), parseInt(startMin), 0, 0);

      if (bookingDate < now) {
        console.log(
          `❌ Expired Booking Found: ${doc.id}, User: ${booking.user}`
        );
        expiredUsers.add(booking.user);

        // Optional: Delete the expired booking from Firestore
        db.collection("slots")
          .doc(doc.id)
          .delete()
          .then(() => {
            console.log(`🗑️ Deleted expired booking: ${doc.id}`);
          })
          .catch((err) =>
            console.error(`⚠️ Error deleting booking: ${doc.id}`, err)
          );
      }
    });

    // Delete expired users
    for (let userId of expiredUsers) {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        console.log(`🗑️ Deleting expired user: ${userId}`);
        await userRef.delete();
      }
    }
  } catch (error) {
    console.error("⚠️ Error checking expired users:", error);
  }
}
// Schedule tasks to run every minute
cron.schedule("* * * * *", async () => {
  console.log("⏳ Running scheduled tasks...");
  await processBookings();
  await cleanUpExpiredUsers();
});

// Start the Express server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
