// EmailJS Email Service
// Documentation: https://www.emailjs.com/docs/

import emailjs from '@emailjs/browser';

// Validate configuration at runtime (only logs warning, doesn't break the app)
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

// Check config immediately in dev
if (import.meta.env.DEV) {
  checkConfig();
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Send notification email to portfolio owner
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

/**
 * Send confirmation email to the user
 */
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
