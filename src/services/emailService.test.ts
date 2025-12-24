import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

const mockEmailJSResponse: EmailJSResponseStatus = { status: 200, text: 'OK' };

vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));

describe('emailService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'test_service');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_NOTIFICATION', 'test_template_notif');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_CONFIRMATION', 'test_template_confirm');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'test_public_key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('handleContactSubmission', () => {
    const validFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
    };

    it('should successfully send email when emailjs succeeds', async () => {
      vi.mocked(emailjs.send).mockResolvedValue(mockEmailJSResponse);
      const { handleContactSubmission } = await import('./emailService');

      const result = await handleContactSubmission(validFormData);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(emailjs.send).toHaveBeenCalledTimes(2);
    });

    it('should return error when emailjs fails', async () => {
      vi.mocked(emailjs.send).mockRejectedValue(new Error('Network error'));
      const { handleContactSubmission } = await import('./emailService');

      const result = await handleContactSubmission(validFormData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should send correct data to emailjs', async () => {
      vi.mocked(emailjs.send).mockResolvedValue(mockEmailJSResponse);
      const { handleContactSubmission } = await import('./emailService');

      await handleContactSubmission(validFormData);

      expect(emailjs.send).toHaveBeenCalledWith(
        'test_service',
        'test_template_notif',
        expect.objectContaining({
          name: validFormData.name,
          email: validFormData.email,
          message: validFormData.message,
        }),
        'test_public_key'
      );
    });

    it('should send notification and confirmation emails', async () => {
      vi.mocked(emailjs.send).mockResolvedValue(mockEmailJSResponse);
      const { handleContactSubmission } = await import('./emailService');

      await handleContactSubmission(validFormData);

      expect(emailjs.send).toHaveBeenCalledTimes(2);
    });

    it('should succeed even if confirmation email fails', async () => {
      vi.mocked(emailjs.send)
        .mockResolvedValueOnce(mockEmailJSResponse)
        .mockRejectedValueOnce(new Error('Confirmation failed'));
      const { handleContactSubmission } = await import('./emailService');

      const result = await handleContactSubmission(validFormData);

      expect(result.success).toBe(true);
    });
  });
});
