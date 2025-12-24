/**
 * @file Contact.tsx
 * @description Contact form app with email submission and social links display.
 */

import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './Contact.module.css';
import { contactMethods } from '../../data/portfolio';
import { handleContactSubmission } from '../../services/emailService';
import { useNotification } from '../../context/NotificationContext';
import { useTranslation } from '../../context/I18nContext';

/** Contact form data structure */
interface FormData {
  name: string;
  email: string;
  message: string;
}

/** Form submission status states */
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/** Cooldown between submissions in milliseconds */
const SUBMIT_COOLDOWN = 5000;

/**
 * Contact application component.
 * Provides a form for sending messages and displays alternative contact methods.
 */
export default function Contact() {
  const { showToast } = useNotification();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [honeypot, setHoneypot] = useState('');
  const lastSubmitRef = useRef<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (status === 'error' || status === 'success') {
      setStatus('idle');
    }
  };

  const validateForm = (): string | null => {
    if (honeypot) {
      return 'Spam detected';
    }

    if (formData.name.length < 2 || formData.name.length > 100) {
      return 'Le nom doit contenir entre 2 et 100 caractères';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Email invalide';
    }

    if (formData.message.length < 10 || formData.message.length > 5000) {
      return 'Le message doit contenir entre 10 et 5000 caractères';
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitRef.current < SUBMIT_COOLDOWN) {
      showToast('Veuillez attendre avant de renvoyer un message', 'warning');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      if (validationError !== 'Spam detected') {
        setStatus('error');
        setErrorMessage(validationError);
      }
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    lastSubmitRef.current = now;

    const result = await handleContactSubmission(formData);

    if (result.success) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      showToast(`✅ ${t.contactPage.success}`, 'success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || t.contactPage.errorDetail);
      showToast(`❌ ${t.common.error}`, 'error');
    }
  };

  return (
    <div className={styles.contact}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t.contactPage.title}</h1>
        <p className={styles.subtitle}>{t.contactPage.otherWays}</p>
      </div>

      <div className={styles.methods}>
        {contactMethods.map((method) => (
          <a
            key={method.label}
            href={method.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.methodCard}
          >
            <div className={styles.methodIcon}>
              <method.icon />
            </div>
            <div className={styles.methodInfo}>
              <div className={styles.methodLabel}>{method.label}</div>
              <div className={styles.methodValue}>{method.value}</div>
            </div>
          </a>
        ))}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>{t.contactPage.send}</h2>

        {status === 'success' && (
          <div className={styles.successMessage}>
            <CheckCircle size={20} />
            <span>{t.contactPage.successDetail}</span>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorMessage}>
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="name">
            {t.contactPage.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.formInput}
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={100}
            disabled={status === 'loading'}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">
            {t.contactPage.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.formInput}
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="message">
            {t.contactPage.message}
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.formTextarea}
            value={formData.message}
            onChange={handleChange}
            required
            disabled={status === 'loading'}
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <Loader2 size={16} className={styles.spinner} />
              {t.contactPage.sending}
            </>
          ) : (
            <>
              <Send size={16} />
              {t.contactPage.send}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
