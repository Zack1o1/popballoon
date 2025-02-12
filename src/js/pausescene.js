class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
    this.score = 0;
  }
  create(data) {
    this.score = data?.score ?? this.score;
    this.highscore = data?.highScore ?? this.score;
    this.music = data?.music;
    new MyImage(this, 400, 300, "bg").setScale(2);
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;
    this.createUI();
  }
  createUI() {
    this.setMusic();
    this.createBoard();
    this.createScoreButton();
    this.createResumeButton();
    this.createRestartButton();
    this.createVolumeButton();
    this.createHomeButton();
    this.setFunctionality();
  }
  createBoard() {
    const boardConfig = {
      x: this.centerX,
      y: this.centerY,
      image: "board",
      scale: getScale(200),
    };
    new MyImage(this, boardConfig.x, boardConfig.y, boardConfig.image).setScale(
      boardConfig.scale
    );
  }
  createScoreButton() {
    const scoreBtnConfig = {
      x: this.centerX,
      y: this.centerY - 100,
      image: "btn",
      scale: getScale(200),
      _: {
        x: this.centerX - 70,
        y: this.centerY - 118,
        text: `Score: ${this.score.toString().padStart(3, "0")}`,
        fontSize: 30,
        color: "#ffffff",
      },
    };
    new MyImage(
      this,
      scoreBtnConfig.x,
      scoreBtnConfig.y,
      scoreBtnConfig.image
    ).setScale(scoreBtnConfig.scale);
    new MyText(
      this,
      scoreBtnConfig._.x,
      scoreBtnConfig._.y,
      scoreBtnConfig._.text,
      scoreBtnConfig._.fontSize,
      scoreBtnConfig._.color
    );
  }
  createResumeButton() {
    const resumeConfig = {
      x: this.centerX,
      y: this.centerY - 40,
      image: "resume",
      scale: getScale(200),
    };
    this.resumeBtn = new MyImage(
      this,
      resumeConfig.x,
      resumeConfig.y,
      resumeConfig.image
    ).setScale(resumeConfig.scale);
  }
  createRestartButton() {
    const restartConfig = {
      x: this.centerX,
      y: this.centerY + 20,
      image: "restart",
      scale: getScale(200),
    };
    this.restartBtn = new MyImage(
      this,
      restartConfig.x,
      restartConfig.y,
      restartConfig.image
    ).setScale(restartConfig.scale);
  }
  createVolumeButton() {
    const volumeConfig = {
      x: this.centerX - 40,
      y: this.centerY + 90,
      scale: getScale(200),
    };
    new VolumeControl(
      this,
      volumeConfig.x,
      volumeConfig.y,
      volumeConfig.scale,
      this.music
    );
  }
  createHomeButton() {
    const homeConfig = {
      x: this.centerX + 20,
      y: this.centerY + 90,
      image: "home",
      scale: getScale(200),
    };
    this.homeBtn = new MyImage(
      this,
      homeConfig.x,
      homeConfig.y,
      homeConfig.image
    ).setScale(homeConfig.scale);
  }
  setMusic() {
    this.music.play();
    this.music.setVolume(1);
  }
  resumeGame() {
    this.scene.stop("PauseScene").resume("GameScene");
    this.music.setVolume(0.1);
  }
  restartGame() {
    this.score = 0;
    this.scene.stop("PauseScene");
    this.scene.stop("GameScene");
    this.scene.start("GameScene");
  }
  homeScreen() {
    this.score = 0;
    this.scene.stop("PauseScene");
    this.scene.stop("GameScene");
    this.music.stop();
    this.scene.start("WelcomeScene", { highScore: this.highscore });
  }
  setFunctionality() {
    this.resumeBtn.setInteractive().on("pointerdown", () => this.resumeGame());
    this.restartBtn.setInteractive().on("pointerdown", () => this.restartGame());
    this.homeBtn.setInteractive().on("pointerdown", () => this.homeScreen());
  }
}
