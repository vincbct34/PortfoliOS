import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleContactSubmission } from './emailService';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

// Mock response for emailjs.send
const mockEmailJSResponse: EmailJSResponseStatus = { status: 200, text: 'OK' };

// Mock emailjs
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));

// Mock import.meta.env
const mockEnv = {
  VITE_EMAILJS_SERVICE_ID: 'test_service',
  VITE_EMAILJS_TEMPLATE_NOTIFICATION: 'test_template_notif',
  VITE_EMAILJS_TEMPLATE_CONFIRMATION: 'test_template_confirm',
  VITE_EMAILJS_PUBLIC_KEY: 'test_public_key',
  DEV: false,
};

vi.stubGlobal('import', {
  meta: {
    env: mockEnv,
  },
});

describe('emailService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleContactSubmission', () => {
    const validFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
    };

    it('should successfully send email when emailjs succeeds', async () => {
      vi.mocked(emailjs.send).mockResolvedValue(mockEmailJSResponse);

      const result = await handleContactSubmission(validFormData);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(emailjs.send).toHaveBeenCalledTimes(2); // notification + confirmation
    });

    it('should return error when emailjs fails', async () => {
      vi.mocked(emailjs.send).mockRejectedValue(new Error('Network error'));

      const result = await handleContactSubmission(validFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should send correct data to emailjs', async () => {
      vi.mocked(emailjs.send).mockResolvedValue(mockEmailJSResponse);

      await handleContactSubmission(validFormData);

      // Check first call (notification)
      expect(emailjs.send).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        {
          name: validFormData.name,
          email: validFormData.email,
          message: validFormData.message,
        },
        expect.any(String)
      );
    });

    it('should send notification and confirmation emails', async () => {
      const sendSpy = vi.mocked(emailjs.send).mockResolvedValue(mockEmailJSResponse);

      await handleContactSubmission(validFormData);

      // Should send two emails: notification + confirmation
      expect(sendSpy).toHaveBeenCalledTimes(2);
    });

    it('should succeed even if confirmation email fails', async () => {
      vi.mocked(emailjs.send)
        .mockResolvedValueOnce(mockEmailJSResponse) // notification succeeds
        .mockRejectedValueOnce(new Error('Confirmation failed')); // confirmation fails

      const result = await handleContactSubmission(validFormData);

      // Should still succeed because notification was sent
      expect(result.success).toBe(true);
    });
  });
});
