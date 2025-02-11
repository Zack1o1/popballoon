const sceneContainer = document.querySelector(".scene");
let score = 0;
let gameTime = 60;
let balloonGravity = -60;
let highScoreLocal = localStorage.getItem("high score") || 0;

if ((highScoreLocal) < 10) {
  highScoreLocal = `00${highScoreLocal}`;
}
else if ((highScoreLocal) < 100) {
  highScoreLocal = `0${highScoreLocal}`;
}
let music;
class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("WelcomeScene");
  }
  preload() {
    this.load.image("ballon", "/src/asset/ballon.png");
    this.load.svg("balloon", "/src/asset/balloon.svg");
    this.load.svg("welcome", "/src/asset/welcome.svg");
    this.load.svg("highscore", "/src/asset/highscore.svg");
    this.load.image("bg", "/src/asset/bg.png");
    this.load.svg("board", "/src/asset/board.svg");
    this.load.svg("btn", "/src/asset/btn.svg");
    this.load.svg("home", "/src/asset/home.svg");
    this.load.svg("what", "/src/asset/what.svg");
    this.load.svg("howtoplay", "/src/asset/howtoplay.svg");
    this.load.svg("menu", "/src/asset/menu.svg");
    this.load.svg("line", "/src/asset/line.svg");
    this.load.svg("playbtn", "/src/asset/playbtn.svg");
    this.load.svg("restart", "/src/asset/restart.svg");
    this.load.svg("playagain", "/src/asset/playagain.svg");
    this.load.svg("resume", "/src/asset/resume.svg");
    this.load.svg("rules", "/src/asset/rules.svg");
    this.load.svg("timer", "/src/asset/timer.svg");
    this.load.svg("volumeOn", "/src/asset/musicOn.svg");
    this.load.svg("volumeOff", "/src/asset/musicOff.svg");
    this.load.audio("music", "/src/asset/audio/gameMusic.mp3");
    this.load.audio("pop", "/src/asset/audio/popBallon.mp3");
    this.load.audio("over", "/src/asset/audio/gameOver.mp3");
    this.load.audio("timeup", "/src/asset/audio/notime.mp3");

  }
  create() {
    this.add.image(400, 300, "bg").setScale(2);

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const welcome = {
      x: centerX,
      y: centerY - 80,
      image: "welcome",
      scale: getScale(250),
    }
    const highScore = {
      x: centerX - 2,
      y: centerY - 165,
      image: "highscore",
      scale: getScale(250),
      _: {
        x: centerX - 88,
        y: centerY - 180,
        text: `High Score: ${highScoreLocal}`,
        fontSize: 24,
        color: "#ffffff"
      }
    }
    const volume = {
      x: centerX,
      y: centerY + 23,
      image: "volumeOn",
      image_: "volumeOff",
      scale: getScale(220),
    }
    const playBtn = {
      x: centerX,
      y: centerY + 180,
      image: "playbtn",
      scale: getScale(250),
    }
    const howtoplay = {
      x: centerX + 300,
      y: centerY + 200,
      image: "howtoplay",
      scale: getScale(250),
      _: {
        x: centerX + 290,
        y: centerY + 115,
        image: "rules",
        scale: getScale(250)
      }
    }
    const ballon = {
      x: centerX + 225,
      y: centerY - 115,
      image: "ballon",
      scale: getScale(360),
    }
    this.welcomeBoard = new MyImage(this, welcome.x, welcome.y, welcome.image).setScale((welcome.scale));
    this.balloon = new MyImage(this, ballon.x, ballon.y, ballon.image).setScale((ballon.scale))
    this.highscoreBoard = new MyImage(this, highScore.x, highScore.y, highScore.image).setScale((highScore.scale));
    let startBtn = new MyImage(this, playBtn.x, playBtn.y, playBtn.image).setScale((playBtn.scale));
    let rulesBtn = new MyImage(this, howtoplay.x, howtoplay.y, howtoplay.image).setScale((howtoplay.scale));
    let rules = new MyImage(this, howtoplay._.x, howtoplay._.y, howtoplay._.image).setScale((howtoplay._.scale));
    this.highscoreText = new MyText(this, highScore._.x, highScore._.y, highScore._.text, highScore._.fontSize, highScore._.color)

    rules.setVisible(false)
    rulesBtn
      .setInteractive()
      .on("pointerover", () => {
        rules.setVisible(true)
      })
      .on("pointerout", () => {
        this.time.delayedCall(1000, () => {
          rules.setVisible(false)
        })
      })

    music = this.sound.add("music");
    music.play();
    music.setDetune(-800);
    window.innerWidth < 700 ? new VolumeControl(this, volume.x, volume.y - 35, volume.scale, music) : new VolumeControl(this, volume.x, volume.y, volume.scale, music);
    // let whatBtn = this.add.image(volume.x + 55, volume.y, "what").setScale((volume.scale));
    startBtn
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("GameScene");
      })
      // for mobile
    if (window.innerWidth < 700) {
      this.balloon.setVisible(false)
      this.highscoreBoard.setY(centerY / 1.9)
      this.highscoreText.setFontSize(16).setY(centerY / 1.98).setX(centerX / 1.45)
      startBtn.setY(centerY + 80)
      rulesBtn.setY(centerY + 250).setX(centerX).setScale(0.5)
      rules.setY(centerY + 170).setX(centerX - 10).setScale(0.5)
    }
  }
}
class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }
  create(data) {
    this.add.image(400, 300, "bg").setScale(2);
    this.totalTime = data?.t ?? gameTime;
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    music.setVolume(0.1);
    const wallConfig = {
      x: 700,
      y: 0,
      image: "line",
      scale: 0.8,
    }
    const menuConfig = {
      x: centerX / 7.5,
      y: centerY * 1.83,
      image: "menu",
      scale: getScale(180)
    }
    const scoreConfig = {
      x: centerX * 1.79,
      y: centerY * 1.83,
      image: "btn",
      scale: getScale(182),
      _: {
        x: centerX * 1.66,
        y: centerY * 1.76,
        text: `Score: 000`,
        fontSize: 36,
        color: "#ffffff"
      }
    }
    const timerConfig = {
      x: centerX,
      y: 40,
      image: "timer",
      scale: getScale(170),
      _: {
        x: centerX - 18,
        y: 18,
        text: `${this.totalTime}`,
        fontSize: 40,
        color: "#ffffff",
      }
    }

    this.wall = new MyImage(this, wallConfig.x, wallConfig.y, wallConfig.image).setScale(wallConfig.scale);
    let menuBtn = new MyImage(this, menuConfig.x, menuConfig.y, menuConfig.image).setScale(menuConfig.scale);
    menuBtn
      .setDepth(10)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.pause("GameScene").launch("PauseScene", { t: this.totalTime });
      })

    this.scoreBoard = new MyImage(this, scoreConfig.x, scoreConfig.y, scoreConfig.image).setScale(scoreConfig.scale).setDepth(10);
    this.scoreText = new MyText(this, scoreConfig._.x, scoreConfig._.y, scoreConfig._.text, scoreConfig._.fontSize, scoreConfig._.color).setDepth(11);
    new MyImage(this, timerConfig.x, timerConfig.y, timerConfig.image).setScale(timerConfig.scale).setDepth(10);
    this.timeText = new MyText(this, timerConfig._.x, timerConfig._.y, timerConfig._.text, timerConfig._.fontSize, timerConfig._.color).setDepth(11);

    this.time.delayedCall(1000, () => {
      this.timer = this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true,
      });
    })

    this.balloons = this.physics.add.group();
    this.balloonDelay = 600;
    this.balloonApear = this.time.addEvent({
      delay: this.balloonDelay,
      callback: this.spawnBalloon,
      callbackScope: this,
      loop: true,
    });
    this.wall.setDepth(9);
    this.physics.add.existing(this.wall);
    this.wall.body.setImmovable(true);
    this.wall.body.setAllowGravity(false);
    // for mobile
    if (window.innerWidth < 700) {
      menuBtn.setX(centerX * 0.3);
      this.scoreBoard.setX(centerX * 1.53);
      this.scoreText.setScale(0.78).setX(centerX * 1.17).setY(centerY * 1.78);
      this.hightRate = 1.8;
      this.balloonDelay = 300;
    }
  }
  spawnBalloon() {
    this.hightRate = 1.6
    const spawnArea = { x: 140, y: 580, width: window.innerWidth / 1.6, height: window.innerHeight / this.hightRate };
    const x = Phaser.Math.Between(spawnArea.x, spawnArea.x + spawnArea.width);
    const y = Phaser.Math.Between(spawnArea.y, spawnArea.y + spawnArea.height);

    const balloon = this.balloons.create(x, y, "balloon");
    balloon.setScale(0.6).setInteractive();
    balloon.on("pointerdown", () => {
      this.popBalloon = this.sound.add("pop");
      this.popBalloon.play();
      this.popBalloon.setVolume(1);
      balloon.destroy();
      score += 5;
      this.scoreText.setText(`Score: ${score.toString().padStart(3, '0')}`);
      if (score > highScoreLocal) {
        localStorage.setItem("high score", score);
        highScoreLocal = score;
      }
    });
    this.physics.add.collider(balloon, this.wall, () => {
      if (this.timeupSound) {
        this.timeupSound.stop();
      }
      this.time.delayedCall(200, () => {
        this.gameOver = this.sound.add("over");
        this.gameOver.play();
        this.gameOver.setVolume(1);
        this.scene.pause().launch("GameOverScene");
      })
    });

  }
  update() {
    // changing speed according to time
    if (this.totalTime <= 45) {
      this.physics.world.gravity.y = -80;
    }
    if (this.totalTime <= 30) {
      this.physics.world.gravity.y = -120;
    }
    if (this.totalTime <= 15) {
      this.physics.world.gravity.y = -140;
    }
    if (window.innerWidth < 700) {
      this.physics.world.gravity.y = -250;
    }
  }
  updateTimer() {
    this.totalTime--;
    this.timeText.setText(this.totalTime < 10 ? `0${this.totalTime}` : this.totalTime);
    if (this.totalTime > 1 && this.totalTime <= 10) {
      this.timeupSound = this.sound.add("timeup");
      this.timeupSound.play();
      this.timeupSound.setVolume(1);
    }
    if (this.totalTime <= 0) {
      if (!this.gameOver) {
        this.gameOver = this.sound.add("over");
        this.gameOver.play();
        this.gameOver.setVolume(1);
      }
      this.timer.remove();
      this.balloonApear.remove();
      this.scene.pause().launch("GameOverScene");
    }

  }
}
class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
  }
  create() {
    this.add.image(400, 300, "bg").setScale(2);
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const board = {
      x: centerX,
      y: centerY,
      image: "board",
      scale: getScale(200),
    }
    const scoreBoard = {
      x: centerX,
      y: centerY - 100,
      image: "btn",
      scale: getScale(200),
      _: {
        x: centerX - 70,
        y: centerY - 118,
        text: `Score: ${highScoreLocal}`,
        fontSize: 30,
        color: "#ffffff"
      }
    }
    const resume = {
      x: centerX,
      y: centerY - 40,
      image: "resume",
      scale: getScale(200),
    }
    const restart = {
      x: centerX,
      y: centerY + 20,
      image: "restart",
      scale: getScale(200),
    }
    const volume = {
      x: centerX - 40,
      y: centerY + 90,
      scale: getScale(200),
    }
    const home = {
      x: centerX + 20,
      y: centerY + 90,
      image: "home",
      scale: getScale(200),
    }
    this.add.image(board.x, board.y, board.image).setScale(board.scale);
    this.add.image(scoreBoard.x, scoreBoard.y, scoreBoard.image).setScale(scoreBoard.scale);
    new MyText(this, scoreBoard._.x, scoreBoard._.y, scoreBoard._.text, scoreBoard._.fontSize, scoreBoard._.color)
    let resumeBtn = this.add.image(resume.x, resume.y, resume.image).setScale(resume.scale);
    resumeBtn
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop("PauseScene").resume("GameScene");
        music.setVolume(0.1);

      })
    let restartBtn = this.add.image(restart.x, restart.y, restart.image).setScale(restart.scale);
    restartBtn
      .setInteractive()
      .on("pointerdown", () => {
        score = 0;
        this.scene.stop("PauseScene");
        this.scene.stop("GameScene");
        this.scene.start("GameScene", { t: gameTime });
      })
    music.setVolume(1)
    music.play()
    new VolumeControl(this, volume.x, volume.y, volume.scale, music)
    let homeBtn = this.add.image(home.x, home.y, home.image).setScale(home.scale);
    homeBtn
      .setInteractive()
      .on("pointerdown", () => {
        score = 0;
        this.scene.stop("PauseScene");
        this.scene.stop("GameScene");
        music.stop();
        this.scene.start("WelcomeScene");
      })
  }
}
class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }
  create() {
    this.add.image(400, 300, "bg").setScale(2);
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const board = {
      x: centerX,
      y: centerY,
      image: "board",
      scale: getScale(200),
    }
    const scoreBoard = {
      x: centerX,
      y: centerY - 84,
      image: "btn",
      scale: getScale(200),
      _: {
        x: centerX - 70,
        y: centerY - 100,
        text: `Score: ${score}`,
        fontSize: 30,
        color: "#ffffff"
      }
    }
    const playAgain = {
      x: centerX,
      y: centerY - 20,
      image: "playagain",
      scale: getScale(200),
    }
    const volume = {
      x: centerX - 40,
      y: centerY + 60,
      scale: getScale(200),
    }
    const home = {
      x: centerX + 20,
      y: centerY + 60,
      image: "home",
      scale: getScale(200),
    }
    this.add.image(board.x, board.y, board.image).setScale(board.scale);
    this.add.image(scoreBoard.x, scoreBoard.y, scoreBoard.image).setScale(scoreBoard.scale);
    new MyText(this, scoreBoard._.x, scoreBoard._.y, scoreBoard._.text, scoreBoard._.fontSize, scoreBoard._.color)
    let playAgainBtn = this.add.image(playAgain.x, playAgain.y, playAgain.image).setScale(playAgain.scale);
    playAgainBtn
      .setInteractive()
      .on("pointerdown", () => {
        score = 0;
        this.scene.stop("GameOverScene");
        this.scene.stop("GameScene");
        this.scene.start("GameScene", { t: gameTime });
      })

    music.setVolume(1)
    music.play()
    new VolumeControl(this, volume.x, volume.y, volume.scale, music)
    let homeBtn = this.add.image(home.x, home.y, home.image).setScale(home.scale);
    homeBtn
      .setInteractive()
      .on("pointerdown", () => {
        score = 0;
        music.stop();
        this.scene.stop("GameOverScene");
        this.scene.stop("GameScene")
        this.scene.start("WelcomeScene");
      })
  }
}

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
      gravity: { y: balloonGravity },
      debug: false,
    },
  }
};

const game = new Phaser.Game(config);

function getFontSize() {
  return Math.max(24, Math.min(window.innerWidth, window.innerHeight) * 0.08);
}
function getScale(baseSize) {
  return (Math.min(window.innerWidth, window.innerHeight) * 0.2) / baseSize;
}
class MyText extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, fontSiz = 48, color = "#000", options = {}) {
    const style = {
      color: color,
      fontSize: `${fontSiz}px`,
      fontFamily: "Irish Grover",
      align: "center",
      ...options,
    }
    super(scene, x, y, text, style);
    scene.add.existing(this);
  }
}

class MyImage extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
  }
}
class VolumeControl {
  constructor(scene, x, y, scale, music) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.music = music;

    this.volumeOn = new MyImage(scene, x, y, "volumeOn").setScale(scale).setInteractive().setFlipX(true);
    this.volumeOff = new MyImage(scene, x, y, "volumeOff").setScale(scale).setInteractive().setFlipX(true);

    this.volumeOff.setVisible(false);
    this.music.setLoop(true);

    this.volumeOn.on("pointerdown", () => {
      this.toggleVolume();
    });

    this.volumeOff.on("pointerdown", () => {
      this.toggleVolume();
    });
  }

  toggleVolume() {
    if (this.volumeOn.visible) {
      this.music.pause();
      this.volumeOn.setVisible(false);
      this.volumeOff.setVisible(true);
    } else {
      this.music.resume();
      this.music.setVolume(1);
      this.volumeOn.setVisible(true);
      this.volumeOff.setVisible(false);
    }
  }
}

