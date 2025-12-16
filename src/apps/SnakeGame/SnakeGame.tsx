import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useSystemSettings } from '../../context/SystemSettingsContext';
import { useTranslation } from '../../context/I18nContext';
import styles from './SnakeGame.module.css';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 50;

const HIGH_SCORE_KEY = 'snake-high-score';

export default function SnakeGame() {
  const { showToast, addNotification } = useNotification();
  const { playSound } = useSystemSettings();
  const { t, language } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);
  const gameOverHandledRef = useRef(false);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPlaying(false);
    gameOverHandledRef.current = false;
  }, [generateFood]);

  // Game over handler
  const handleGameOver = useCallback(() => {
    // Prevent duplicate calls
    if (gameOverHandledRef.current) return;
    gameOverHandledRef.current = true;

    playSound('game-over');
    setIsPlaying(false);
    setIsGameOver(true);

    const newRecordText = language === 'fr' ? 'Nouveau record' : 'New record';
    const gameOverText = language === 'fr' ? 'Partie terminée avec' : 'Game ended with';
    const pointsText = language === 'fr' ? 'points' : 'points';

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      showToast(`🏆 ${newRecordText}: ${score} ${pointsText}!`, 'success', 5000);
      addNotification('Snake Game', `${newRecordText}: ${score} ${pointsText}!`, 'success');
    } else {
      showToast(`${t.snakeGame.gameOver} ${t.snakeGame.score}: ${score}`, 'info');
      addNotification('Snake Game', `${gameOverText} ${score} ${pointsText}`, 'info');
    }
  }, [score, highScore, showToast, addNotification, playSound, language, t]);

  // Move snake
  const moveSnake = useCallback(() => {
    setSnake((currentSnake) => {
      const head = currentSnake[0];
      const dir = directionRef.current;

      let newHead: Position;
      switch (dir) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        handleGameOver();
        return currentSnake;
      }

      // Check self collision
      if (currentSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check if eating food
      if (newHead.x === food.x && newHead.y === food.y) {
        playSound('game-eat');
        setFood(generateFood(newSnake));
        setScore((s) => s + 10);
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        return newSnake; // Don't remove tail (snake grows)
      }

      newSnake.pop(); // Remove tail
      return newSnake;
    });
  }, [food, generateFood, handleGameOver, playSound]);

  // Game loop
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, isGameOver, speed, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const currentDir = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') {
            setDirection('UP');
            directionRef.current = 'UP';
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') {
            setDirection('DOWN');
            directionRef.current = 'DOWN';
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') {
            setDirection('LEFT');
            directionRef.current = 'LEFT';
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') {
            setDirection('RIGHT');
            directionRef.current = 'RIGHT';
          }
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    const gradient = ctx.createRadialGradient(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      0,
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    );
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#c92a2a');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const hue = 120 + index * 2; // Gradient from green to teal
      ctx.fillStyle = isHead ? '#22c55e' : `hsl(${hue}, 70%, 50%)`;
      ctx.shadowColor = isHead ? '#22c55e' : 'transparent';
      ctx.shadowBlur = isHead ? 10 : 0;

      ctx.beginPath();
      ctx.roundRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
        isHead ? 6 : 4
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  // Sync direction ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const togglePlay = () => {
    if (isGameOver) {
      resetGame();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.scoreSection}>
          <div className={styles.score}>
            <span className={styles.label}>{t.snakeGame.score}</span>
            <span className={styles.value}>{score}</span>
          </div>
          <div className={styles.highScore}>
            <Trophy size={16} />
            <span>{highScore}</span>
          </div>
        </div>
        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className={styles.controlButton} onClick={resetGame} title="Restart">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Game Canvas */}
      <div className={styles.gameWrapper}>
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className={styles.canvas}
        />

        {/* Overlay for game states */}
        {!isPlaying && !isGameOver && (
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <h2>🐍 {t.snakeGame.title}</h2>
              <p>{t.snakeGame.startHint}</p>
              <div className={styles.instructions}>
                <span>↑ ↓ ← → / WASD</span>
              </div>
            </div>
          </div>
        )}

        {isGameOver && (
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <h2>{t.snakeGame.gameOver}</h2>
              <p className={styles.finalScore}>
                {t.snakeGame.score}: {score}
              </p>
              {score >= highScore && score > 0 && (
                <p className={styles.newRecord}>🏆 {t.snakeGame.highScore}!</p>
              )}
              <button className={styles.retryButton} onClick={togglePlay}>
                <RotateCcw size={18} />
                {t.snakeGame.playAgain}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span>Space: Pause | ↑↓←→: Move</span>
      </div>
    </div>
  );
}
