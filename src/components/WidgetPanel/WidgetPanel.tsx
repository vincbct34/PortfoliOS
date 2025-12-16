import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [weather, setWeather] = useState<WeatherState>({
    data: null,
    loading: true,
    error: false,
    city: 'Paris',
  });

  const loadWeather = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

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

  const now = new Date();

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
        {/* Clock Widget */}
        <div className={styles.widget}>
          <div className={styles.clockWidget}>
            <div className={styles.clockTime}>
              {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className={styles.clockDate}>
              {now.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className={styles.widget}>
          <div className={styles.weatherWidget}>
            {weather.loading ? (
              <div className={styles.weatherLoading}>
                <Loader2 size={32} className={styles.spinner} />
                <span>Chargement météo...</span>
              </div>
            ) : weather.error ? (
              <div className={styles.weatherError}>
                <Cloud size={32} />
                <span>Météo indisponible</span>
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
          <h3 className={styles.widgetTitle}>Liens rapides</h3>
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
          <h3 className={styles.widgetTitle}>Portfolio Stats</h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>5+</span>
              <span className={styles.statLabel}>Projets</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>3+</span>
              <span className={styles.statLabel}>Années XP</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>10+</span>
              <span className={styles.statLabel}>Technologies</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
