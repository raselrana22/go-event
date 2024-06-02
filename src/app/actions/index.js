"use server";

import {
  createUser,
  findUserByCredentials,
  getEventById,
  updateGoing,
  updateInterest,
} from "@/db/queries";

import { Resend } from "resend";

import EmailTemplate from "@/components/auth/EmailTemplate";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function registerUser(formData) {
  const user = Object.fromEntries(formData);
  const created = await createUser(user);
  redirect("/login");
}

async function performLogin(formData) {
  try {
    const credential = {};
    credential.email = formData.get("email");
    credential.password = formData.get("password");
    const found = await findUserByCredentials(credential);
    return found;
  } catch (error) {
    throw error;
  }
}

async function addInterestedEvent(eventId, authId) {
  try {
    await updateInterest(eventId, authId);
  } catch (error) {
    throw error;
  }
  revalidatePath("/");
}

async function addGoingEvent(eventId, user) {
  try {
    await updateGoing(eventId, user?.id);
    // await sendEmail(eventId, user);
  } catch (error) {
    throw error;
  }
  revalidatePath("/");
  redirect("/");
}

async function sendEmail(eventId, user) {
  try {
    console.log("Event ID:", eventId);
    console.log("User:", user);
    console.log("Resend API Key:", process.env.RESEND_API_KEY);

    const event = await getEventById(eventId);
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found.`);
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const message = `Dear ${user?.name}, you have been successfully registered for the event, ${event?.name}. Please carry this email and your official id to the venue. We are excited to have you here.`;
    const sent = await resend.emails.send({
      from: "noreply@noreply.tapascript.io",
      to: user?.email,
      subject: "Successfully Registered for the event!",
      react: EmailTemplate(message),
    });
    // Log the result for debugging
    console.log("Email sent:", sent);
  } catch (error) {
    throw error;
  }
}

export { addGoingEvent, addInterestedEvent, performLogin, registerUser };
