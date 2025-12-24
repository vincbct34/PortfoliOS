/**
 * @file emailService.ts
 * @description Email sending service using EmailJS for contact form submissions.
 */

import emailjs from '@emailjs/browser';

/**
 * Checks if EmailJS is properly configured with environment variables.
 * @returns True if all required env vars are set
 */
const checkConfig = () => {
  const isEmailConfigured = Boolean(
    import.meta.env.VITE_EMAILJS_SERVICE_ID &&
    import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFICATION &&
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
  if (!isEmailConfigured && import.meta.env.DEV) {
    console.warn(
      'EmailJS is not configured. Contact form will not work. Please check your .env file.'
    );
  }
  return isEmailConfigured;
};

if (import.meta.env.DEV) {
  checkConfig();
}

/** Contact form data structure */
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Sends a notification email using EmailJS.
 * @param data - Contact form data
 * @returns Promise resolving to success status
 */
async function sendNotification(data: ContactFormData): Promise<boolean> {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFICATION;

  if (!publicKey || !serviceId || !templateId) {
    console.error('EmailJS configuration is missing');
    return false;
  }
  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        site_name: 'PortfoliOS',
        name: data.name,
        email: data.email,
        message: data.message,
      },
      publicKey
    );
    return true;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
}

async function sendConfirmation(data: ContactFormData): Promise<boolean> {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRMATION;

  if (!publicKey || !serviceId || !templateId) return false;
  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        site_name: 'PortfoliOS',
        name: data.name,
        email: data.email,
        message: data.message,
      },
      publicKey
    );
    return true;
  } catch (error) {
    console.error('Failed to send confirmation:', error);
    return false;
  }
}

export async function handleContactSubmission(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const notificationSent = await sendNotification(data);
    if (!notificationSent) {
      return { success: false, error: "Échec de l'envoi du message" };
    }

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
