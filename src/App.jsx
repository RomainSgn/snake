import { useState, useEffect, useRef } from 'react'
import './App.css'

const BOARD_SIZE = 30;  // Taille de la grille de jeu

const SnakeGame = () => {

  // Etat pour générer l'affichage du bouton d'installation
  const [canInstall, setCanInstall] = useState(false);
  // Référence pour stocker l'événement d'installation
  const deferredPrompt = useRef(null);

  useEffect(() => {
    // Fonction appelée quand l'application peut être installée 
    const handleBeforeInstallPrompt = (e) => {
      // Empêche l'affichage automatique du prompt
      e.preventDefault();
      // Stocke l'évenement pour une utilisation ultérieure
      deferredPrompt.current = e;
      // Affiche notre bouton d'installation
      setCanInstall(true);
    };

    // Ecoute l'évenement d'installation
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Fonction appelée quand l'utilisateur clique sur le bouton d'installation
  const handleInstallClick = async () => {
    if (!deferredPrompt.current) {
      return;
    }

    // Affiche le prompt d'installation natif
    const result = await deferredPrompt.current.prompt();
    console.log(`Installation ${result.outcome}`);
    // Réinstalle l'état
    deferredPrompt.current = null;
    setCanInstall(false);
  };

  const [isPlaying, setIsPlaying] = useState(false); // Le jeu commence en pause
  const [snake, setSnake] = useState([{x: 10, y: 10}]); // Initialisation du serpent
  const [food, setFood] = useState({x: 3, y: 3}); // Initialisation de la food
  const [direction, setDirection] = useState("RIGHT"); // Initialisation de la direction
  const [lastDirection, setLastDirection] = useState("RIGHT"); // Sauvegarde de la dernière direction
  const [bestScore, setBestScore] = useState(() => {
    return Number(localStorage.getItem("bestScore")) || 0;
  }); // Récupération du bestScore ou initialisation à 0
  const [score, setScore] = useState(0); // Initialisation du score
  const [speed, setSpeed] = useState(100); // Vitesse initiale (100ms par mouvement)


  // Gestion des changements de direction avec impossibilité de faire directement demi-tour
  useEffect(() => {
    const handleKeyPress = (event) => {
      let newDirection = direction;
      
      switch (event.key) {
        case "ArrowUp":
          if (lastDirection !== "DOWN") newDirection = "UP"; 
          break;
        case "z":
          if (lastDirection !== "DOWN") newDirection = "UP"; 
          break;
        case "Z":
          if (lastDirection !== "DOWN") newDirection = "UP"; 
          break;
        case "ArrowDown":
          if (lastDirection !== "UP") newDirection = "DOWN";
          break;
        case "s":
          if (lastDirection !== "UP") newDirection = "DOWN";
          break;
        case "S":
          if (lastDirection !== "UP") newDirection = "DOWN";
          break;
        case "ArrowLeft":
          if (lastDirection !== "RIGHT") newDirection = "LEFT";
          break;
        case "q":
          if (lastDirection !== "RIGHT") newDirection = "LEFT";
          break;
        case "Q":
          if (lastDirection !== "RIGHT") newDirection = "LEFT";
          break;
        case "ArrowRight":
          if (lastDirection !== "LEFT") newDirection = "RIGHT";
          break;
        case "d":
          if (lastDirection !== "LEFT") newDirection = "RIGHT";
          break;
        case "D":
          if (lastDirection !== "LEFT") newDirection = "RIGHT";
          break;
        default:
          break;
      }
  
      setDirection(newDirection);
    };

    // Event pour la pression des touches directionnelles
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [lastDirection]);

  // Fonction pour changement de direction du serpent
  useEffect(() => {
    if (!isPlaying) return  // Empêche le mouvement si le jeu est en pause
   
    const moveSnake = () => {
      setSnake((prev) => {
        let newHead = {...prev[0]};
        if (direction === "UP") newHead.y -= 1;
        if (direction === "DOWN") newHead.y += 1;
        if (direction === "LEFT") newHead.x -= 1;
        if (direction === "RIGHT") newHead.x += 1;

        setLastDirection(direction); // Met à jour la dernière direction valide

        const newSnake = [newHead, ...prev.slice(0, -1)];
        return newSnake;
      })
    };

    // Vitesse du serpent
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [isPlaying, direction, speed]);

  useEffect(() => {
    if (score > 0 && score % 50 === 0) { // Accélère tous les 50 points
      setSpeed((prevSpeed) => Math.max(prevSpeed - 10, 50)); // Vitesse minimale : 50ms
    }
  }, [score]);

  // Fonction poour générer de la food dans une position aléatoire mais pas sur le serpent
  const getRandomFoodPosition = (snake) => {
    let newFood;
    let isOnSnake;
    
    do {
      newFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      };
  
      // Vérifie si la position est sur le serpent
      isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (isOnSnake); // Continue tant que la position est occupée
  
    return newFood;
  };

  // Condition si le serpent mange de la food
  if (snake[0].x === food.x && snake[0].y === food.y) {
    setFood(getRandomFoodPosition(snake));
    setScore((prevScore) => prevScore + 10); // Utilise la valeur précédente et l'augmente de 10
    setSnake([...snake, {}]); // Ajoute un bloc au serpent
  }

  // Gestion des collisions
  const checkCollision = (head) => {
    // Collision avec les murs
    if (head.x < 0 || head.y < 0 || head.x >= BOARD_SIZE || head.y >= BOARD_SIZE) {
      return true;
    }
    // Collision avec lui-même
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
  };
  
  useEffect(() => {
    if (checkCollision(snake[0])) {  // Si une collision se produits
      alert("Game Over!");
      setIsPlaying(false); // Arrête le jeu
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem("bestScore", score); // Sauvegarde dans le stockage local
      }
      setSpeed(100) // Réinitialise la speed à 100
      setScore(0); // Réinitialise le score à 0
      setSnake([{ x: 10, y: 10 }]); // Réinitialise le serpent
      setFood(getRandomFoodPosition(snake)); // Nouvelle nourriture
      setDirection("RIGHT"); // Réinitialise la direction
    }
  }, [snake]);
  
  // Affichage de la zone de jeu
  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++){
      for (let x = 0; x < BOARD_SIZE; x++){
        let className = "cell";
        if (snake.some((segment) => segment.x === x && segment.y === y)) {
          className = "cell snake";
        } else if (food.x === x && food.y === y) {
          className = "cell food";
        }
        board.push(<div key={`${x}-${y}`} className={className}></div>);
      }
    }
    return board;
  };

  return (
    <>
    {canInstall && (
        <div className='installContainer'>
          <div className='installText'>
            Voulez-vous intaller l'application sur votre appareil ? 
          </div>
          <button className='installBtn' onClick={handleInstallClick}>Installer</button>
        </div>
      )}
      <div className='score'>
        <h1>Best Score : {bestScore}</h1>
        <h1>Score : {score}</h1>
      </div>
      <div className="game-board">
        {renderBoard()}
      </div>
      <div className='btnStart'>
        {!isPlaying ? 
        <button onClick={() => setIsPlaying(true)}>Start Game</button>
        : ""}
      </div>
      <div className='btnMobile'>
        <button className='dirBtn' onClick={() => direction !== "DOWN" && setDirection("UP")}>Up</button>
        <div className='btnLDR'>
          <button className='dirBtn' onClick={() => direction !== "RIGHT" && setDirection("LEFT")}>Left</button>
          <button className='dirBtn' onClick={() => direction !== "UP" && setDirection("DOWN")}>Down</button>
          <button className='dirBtn' onClick={() => direction !== "LEFT" && setDirection("RIGHT")}>Right</button>
        </div>
      </div>
    </>
  )
};

export default SnakeGame;