import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Mail, Github, Linkedin, Send, type LucideIcon } from 'lucide-react';
import styles from './Contact.module.css';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactMethod {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  // Placeholder contact info - to be filled by user
  const contactMethods: ContactMethod[] = [
    {
      icon: Mail,
      label: 'Email',
      value: 'votre@email.com',
      href: 'mailto:votre@email.com',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/username',
      href: 'https://github.com/username',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/username',
      href: 'https://linkedin.com/in/username',
    },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Integrate with EmailJS, Formspree, or your backend
    // Form data available in: formData.name, formData.email, formData.message
    alert('Message envoyé ! (À implémenter avec un service de mail)');
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
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          <Send size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Envoyer
        </button>
      </form>
    </div>
  );
}
