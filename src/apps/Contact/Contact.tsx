import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './Contact.module.css';
import { contactMethods } from '../../data/portfolio';
import { handleContactSubmission } from '../../services/emailService';
import { useNotification } from '../../context/NotificationContext';

interface FormData {
  name: string;
  email: string;
  message: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const { showToast, addNotification } = useNotification();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Reset status when user starts typing again
    if (status === 'error' || status === 'success') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const result = await handleContactSubmission(formData);

    if (result.success) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      showToast('✅ Message envoyé avec succès !', 'success');
      addNotification('Contact', 'Votre message a été envoyé', 'success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || "Une erreur s'est produite");
      showToast("❌ Échec de l'envoi du message", 'error');
      addNotification('Contact', result.error || "Échec de l'envoi", 'error');
    }
  };

  return (
    <div className={styles.contact}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contactez-moi</h1>
        <p className={styles.subtitle}>N'hésitez pas à me contacter pour discuter de vos projets</p>
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
        <h2 className={styles.formTitle}>Envoyer un message</h2>

        {status === 'success' && (
          <div className={styles.successMessage}>
            <CheckCircle size={20} />
            <span>Message envoyé avec succès ! Je vous répondrai bientôt.</span>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorMessage}>
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="name">
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.formInput}
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom"
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.formInput}
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className={styles.formTextarea}
            value={formData.message}
            onChange={handleChange}
            placeholder="Votre message..."
            required
            disabled={status === 'loading'}
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <Loader2 size={16} className={styles.spinner} />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send size={16} />
              Envoyer
            </>
          )}
        </button>
      </form>
    </div>
  );
}
