import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import styles from './CalendarPopup.module.css';

interface CalendarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// World clock timezones
const WORLD_CLOCKS = [
  { city: 'Paris', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { city: 'New York', timezone: 'America/New_York', flag: '🇺🇸' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
];

export default function CalendarPopup({ isOpen, onClose }: CalendarPopupProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(new Date());
  const popupRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useTranslation();

  const today = new Date();

  // Update current time every second for world clocks
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        const taskbar = document.querySelector('[class*="taskbar"]');
        if (!taskbar?.contains(e.target as Node)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday (0) to 7 for Monday-first week
    return day === 0 ? 6 : day - 1;
  };

  const prevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setDisplayDate(new Date());
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      displayDate.getMonth() === today.getMonth() &&
      displayDate.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(displayDate);
    const firstDay = getFirstDayOfMonth(displayDate);
    const days = [];

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.dayEmpty} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className={`${styles.day} ${isToday(day) ? styles.today : ''}`}>
          {day}
        </div>
      );
    }

    return days;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTimeInTimezone = (timezone: string) => {
    return currentDate.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          className={styles.popup}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          {/* Current time and date */}
          <div className={styles.header}>
            <div className={styles.time}>{formatTime(currentDate)}</div>
            <div className={styles.fullDate}>{formatFullDate(currentDate)}</div>
          </div>

          {/* Calendar navigation */}
          <div className={styles.navigation}>
            <button onClick={prevMonth} className={styles.navButton} aria-label={t.common.close}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={goToToday} className={styles.monthYear}>
              {t.calendar.months[displayDate.getMonth()]} {displayDate.getFullYear()}
            </button>
            <button onClick={nextMonth} className={styles.navButton} aria-label={t.common.open}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Calendar grid */}
          <div className={styles.calendar}>
            <div className={styles.weekdays}>
              {t.calendar.days.map((day: string) => (
                <div key={day} className={styles.weekday}>
                  {day}
                </div>
              ))}
            </div>
            <div className={styles.days}>{renderCalendarDays()}</div>
          </div>

          {/* World Clock Section */}
          <div className={styles.worldClockSection}>
            <div className={styles.worldClockTitle}>
              <Globe size={14} />
              <span>{t.calendar.worldClocks}</span>
            </div>
            <div className={styles.worldClocks}>
              {WORLD_CLOCKS.map((clock) => (
                <div key={clock.city} className={styles.worldClockItem}>
                  <span className={styles.worldClockFlag}>{clock.flag}</span>
                  <span className={styles.worldClockCity}>{clock.city}</span>
                  <span className={styles.worldClockTime}>{getTimeInTimezone(clock.timezone)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
