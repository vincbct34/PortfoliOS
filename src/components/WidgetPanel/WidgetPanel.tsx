import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cloud,
  Sun,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Moon,
  Loader2,
  Wind,
  Droplets,
} from 'lucide-react';
import {
  fetchWeather,
  getUserLocation,
  getWeatherCondition,
  getWeatherIcon,
  type WeatherData,
} from '../../services/weatherService';
import { useTranslation } from '../../context/I18nContext';
import styles from './WidgetPanel.module.css';

interface WidgetPanelProps {
  onClose: () => void;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: boolean;
  city: string;
}

export default function WidgetPanel({ onClose }: WidgetPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherState>({
    data: null,
    loading: true,
    error: false,
    city: 'Paris',
  });

  // Load weather on mount
  useEffect(() => {
    const loadWeather = async () => {
      setWeather((prev) => ({ ...prev, loading: true, error: false }));
      try {
        const location = await getUserLocation();
        const data = await fetchWeather(location.latitude, location.longitude);
        if (data) {
          setWeather({
            data,
            loading: false,
            error: false,
            city: location.city,
          });
        } else {
          setWeather((prev) => ({ ...prev, loading: false, error: true }));
        }
      } catch {
        setWeather((prev) => ({ ...prev, loading: false, error: true }));
      }
    };

    loadWeather();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[class*="taskbar"]')) {
        return;
      }
      if (panelRef.current && !panelRef.current.contains(target)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    document.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const getIconComponent = () => {
    if (!weather.data) return Cloud;
    const iconType = getWeatherIcon(weather.data.weatherCode, weather.data.isDay);
    switch (iconType) {
      case 'sun':
        return Sun;
      case 'moon':
        return Moon;
      case 'cloudRain':
        return CloudRain;
      case 'cloudSnow':
        return CloudSnow;
      case 'cloudLightning':
        return CloudLightning;
      case 'cloudFog':
        return CloudFog;
      default:
        return Cloud;
    }
  };

  const WeatherIcon = getIconComponent();

  const quickLinks = [
    { id: 'github', icon: Github, label: 'GitHub', url: 'https://github.com/vincbct34' },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vincent-bichat',
    },
    { id: 'email', icon: Mail, label: 'Email', url: 'mailto:portfoli-os@outlook.fr' },
  ];

  return (
    <>
      <div className={styles.overlay} />
      <motion.div
        ref={panelRef}
        className={styles.panel}
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Weather Widget */}
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>{t.widgets.weather}</h3>
          <div className={styles.weatherWidget}>
            {weather.loading ? (
              <div className={styles.weatherLoading}>
                <Loader2 size={32} className={styles.spinner} />
                <span>{t.widgets.weatherLoading}</span>
              </div>
            ) : weather.error ? (
              <div className={styles.weatherError}>
                <Cloud size={32} />
                <span>{t.widgets.weatherUnavailable}</span>
              </div>
            ) : (
              <>
                <div className={styles.weatherMain}>
                  <WeatherIcon size={48} className={styles.weatherIcon} />
                  <div className={styles.weatherTemp}>{weather.data?.temperature}°C</div>
                </div>
                <div className={styles.weatherInfo}>
                  <div className={styles.weatherCity}>{weather.city}</div>
                  <div className={styles.weatherCondition}>
                    {weather.data && getWeatherCondition(weather.data.weatherCode)}
                  </div>
                  <div className={styles.weatherDetails}>
                    <span>
                      <Droplets size={14} /> {weather.data?.humidity}%
                    </span>
                    <span>
                      <Wind size={14} /> {weather.data?.windSpeed} km/h
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Links Widget */}
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>{t.widgets.quickLinks}</h3>
          <div className={styles.quickLinks}>
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.quickLink}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                  <ExternalLink size={14} className={styles.externalIcon} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Stats Widget */}
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>{t.widgets.stats}</h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>5+</span>
              <span className={styles.statLabel}>{t.widgets.projects}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>2+</span>
              <span className={styles.statLabel}>{t.widgets.yearsXp}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>10+</span>
              <span className={styles.statLabel}>{t.widgets.technologies}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
