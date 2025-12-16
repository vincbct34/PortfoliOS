// EmailJS Email Service
// Documentation: https://www.emailjs.com/docs/

import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_5xq6beo';
const TEMPLATE_NOTIFICATION =
  import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFICATION || 'template_oc29oje';
const TEMPLATE_CONFIRMATION =
  import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRMATION || 'template_b98cwjq';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Send notification email to portfolio owner
 */
async function sendNotification(data: ContactFormData): Promise<boolean> {
  if (!PUBLIC_KEY) {
    console.error('EmailJS public key is not configured');
    return false;
  }
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_NOTIFICATION,
      {
        name: data.name,
        email: data.email,
        message: data.message,
      },
      PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
}

/**
 * Send confirmation email to the user
 */
async function sendConfirmation(data: ContactFormData): Promise<boolean> {
  if (!PUBLIC_KEY) return false;
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_CONFIRMATION,
      {
        name: data.name,
        email: data.email,
        message: data.message,
      },
      PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error('Failed to send confirmation:', error);
    return false;
  }
}

/**
 * Handle contact form submission
 */
export async function handleContactSubmission(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Send notification to owner
    const notificationSent = await sendNotification(data);
    if (!notificationSent) {
      return { success: false, error: "Échec de l'envoi du message" };
    }

    // Send confirmation to user (don't fail if this fails)
    await sendConfirmation(data);

    return { success: true };
  } catch (error) {
    console.error('Contact submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur s'est produite",
    };
  }
}
