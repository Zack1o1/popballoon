const sceneContainer = document.querySelector(".scene");

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [WelcomeScene, GameScene, PauseScene, GameOverScene],
    transparent: true,
    parent: sceneContainer,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    }
  };
  
  const game = new Phaser.Game(config);