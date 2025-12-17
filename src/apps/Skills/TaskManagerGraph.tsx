import { useRef, useEffect, useCallback } from 'react';
import styles from './GitHubPerformance.module.css';

interface TaskManagerGraphProps {
  data: number[];
  label: string;
  color?: string;
  maxValue?: number;
  height?: number;
  showGrid?: boolean;
}

export default function TaskManagerGraph({
  data,
  label,
  color = '#00d4aa',
  maxValue: propMaxValue,
  height = 120,
  showGrid = true,
}: TaskManagerGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const offsetRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const graphHeight = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, graphHeight);

    // Calculate max value for scaling
    const maxValue = propMaxValue || Math.max(...data, 1);

    // Draw grid lines if enabled
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      // Horizontal lines
      const horizontalLines = 4;
      for (let i = 0; i <= horizontalLines; i++) {
        const y = (graphHeight / horizontalLines) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical lines with scrolling effect
      const verticalSpacing = 40;
      const offset = offsetRef.current % verticalSpacing;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      for (let x = width - offset; x >= 0; x -= verticalSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, graphHeight);
        ctx.stroke();
      }
    }

    // Draw the area fill
    if (data.length > 0) {
      const pointSpacing = width / Math.max(data.length - 1, 1);
      const padding = 4;

      // Create gradient for fill
      const gradient = ctx.createLinearGradient(0, 0, 0, graphHeight);
      gradient.addColorStop(0, `${color}40`);
      gradient.addColorStop(1, `${color}05`);

      ctx.beginPath();
      ctx.moveTo(0, graphHeight);

      data.forEach((value, index) => {
        const x = index * pointSpacing;
        const normalizedValue = value / maxValue;
        const y = graphHeight - normalizedValue * (graphHeight - padding * 2) - padding;
        if (index === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.lineTo(width, graphHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw the line
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      data.forEach((value, index) => {
        const x = index * pointSpacing;
        const normalizedValue = value / maxValue;
        const y = graphHeight - normalizedValue * (graphHeight - padding * 2) - padding;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Animate scroll offset
    offsetRef.current += 0.5;
    animationRef.current = requestAnimationFrame(draw);
  }, [data, color, height, propMaxValue, showGrid]);

  useEffect(() => {
    draw();

    const handleResize = () => {
      draw();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [draw]);

  // Get current and max values for display
  const currentValue = data.length > 0 ? data[data.length - 1] : 0;
  const maxDisplayValue = propMaxValue || Math.max(...data, 1);

  return (
    <div className={styles.graphContainer}>
      <div className={styles.graphHeader}>
        <span className={styles.graphLabel}>{label}</span>
        <span className={styles.graphValue} style={{ color }}>
          {currentValue}
        </span>
      </div>
      <div className={styles.graphWrapper} ref={containerRef}>
        <canvas ref={canvasRef} className={styles.graphCanvas} />
      </div>
      <div className={styles.graphFooter}>
        <span>0</span>
        <span>{maxDisplayValue}</span>
      </div>
    </div>
  );
}
