import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

//Firebase Cloud Functions to send emails securely
const sendEmailFunction = httpsCallable(getFunctions(), 'sendLabAccessEmail');

export const sendLabAccessEmail = async (email, credentials, slotDetails) => {
  try {
    await sendEmailFunction({
      to: email,
      credentials,
      slotDetails
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send lab access email');
  }
};
