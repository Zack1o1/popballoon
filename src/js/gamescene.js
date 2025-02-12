class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.currentScore = 0;
    this.totalGameTime = 60;
    this.balloonGravity = -60;
    this.increaseScoreBy = 10;
  }
  create(data) {
    new MyImage(this, 400, 300, "bg").setScale(2);
    this.totalTime = this.totalGameTime;
    this.highScore = data?.highScore ?? 0;
    this.music = data?.music;
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;
    this.createUI();
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
      this.physics.world.gravity.y = -220;
    }
  }
  createUI() {
    this.music.setVolume(0.1);
    this.createWall();
    this.createTimerBoard();
    this.setTimer();
    this.createBalloon();
    this.createMenuButton();
    this.createScoreBoard();
    this.mobileUI();
  }
  createWall() {
    const wallConfig = {
      x: 700,
      y: 0,
      image: "line",
      scale: 0.8,
    };
    this.wall = new MyImage(
      this,
      wallConfig.x,
      wallConfig.y,
      wallConfig.image
    ).setScale(wallConfig.scale);
    this.physics.add.existing(this.wall);
    this.wall.body.setImmovable(true);
    this.wall.body.setAllowGravity(false);
  }
  createTimerBoard() {
    const timerConfig = {
      x: this.centerX,
      y: 40,
      image: "timer",
      scale: getScale(170),
      _: {
        x: this.centerX - 18,
        y: 18,
        text: `${this.totalTime}`,
        fontSize: 40,
        color: "#ffffff",
      },
    };
    new MyImage(this, timerConfig.x, timerConfig.y, timerConfig.image).setScale(
      timerConfig.scale
    );
    this.timeText = new MyText(
      this,
      timerConfig._.x,
      timerConfig._.y,
      timerConfig._.text,
      timerConfig._.fontSize,
      timerConfig._.color
    );
  }
  createMenuButton() {
    const menuConfig = {
      x: this.centerX / 7.5,
      y: this.centerY * 1.83,
      image: "menu",
      scale: getScale(180),
    };
    this.menuBtn = new MyImage(
      this,
      menuConfig.x,
      menuConfig.y,
      menuConfig.image
    )
      .setScale(menuConfig.scale)
      .setDepth(11)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene
          .pause("GameScene")
          .launch("PauseScene", { score: this.currentScore, music: this.music, highScore: this.highScore });
      });
  }
  createScoreBoard() {
    const scoreConfig = {
      x: this.centerX * 1.79,
      y: this.centerY * 1.83,
      image: "btn",
      scale: getScale(182),
      _: {
        x: this.centerX * 1.66,
        y: this.centerY * 1.76,
        text: `Score: 000`,
        fontSize: 36,
        color: "#ffffff",
      },
    };
    this.scoreBoard = new MyImage(
      this,
      scoreConfig.x,
      scoreConfig.y,
      scoreConfig.image
    ).setScale(scoreConfig.scale).setDepth(11);
    this.scoreText = new MyText(
      this,
      scoreConfig._.x,
      scoreConfig._.y,
      scoreConfig._.text,
      scoreConfig._.fontSize,
      scoreConfig._.color
    );
    this.scoreText.setDepth(12)
  }
  setTimer() {
    this.time.delayedCall(1000, () => {
      this.timer = this.time.addEvent({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true,
      });
    });
  }
  updateTimer(){
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
      this.scene.pause("GameScene").launch("GameOverScene", { music: this.music, score: this.currentScore, highScore: this.highScore });
    }
  }
  createBalloon(){
    this.balloons = this.physics.add.group();
    this.balloonDelay = 600;
    this.balloonApear = this.time.addEvent({
      delay: this.balloonDelay,
      callback: this.produceBalloon,
      callbackScope: this,
      loop: true,
    });
  }
  randomSpawnArea(){
    this.hightRate = 1.6
    const spawnArea = { x: 140, y: 580, width: window.innerWidth / 1.6, height: window.innerHeight / this.hightRate };
    this.spawnX = Phaser.Math.Between(spawnArea.x, spawnArea.x + spawnArea.width);
    this.spawnY = Phaser.Math.Between(spawnArea.y, spawnArea.y + spawnArea.height);
  }
  produceBalloon(){
    this.randomSpawnArea();
    this.balloon = this.balloons.create(this.spawnX, this.spawnY, "balloon");
    this.balloon.setScale(0.6).setInteractive();
    this.balloon.body.gravity.y = this.balloonGravity;
    this.popBalloon(this.balloon)
    this.wallCollided(this.wall, this.balloon)
  }
  popBalloon(balloon){
    balloon.on("pointerdown", () => {
        this.popBalloonSound = this.sound.add("pop");
        this.popBalloonSound.play();
        this.popBalloonSound.setVolume(1);
        balloon.destroy();
        this.updateCurrentScore();
      });
  }
  updateCurrentScore(){
    this.currentScore += this.increaseScoreBy;
    this.scoreText.setText(`Score: ${this.currentScore.toString().padStart(3, '0')}`);
    if (this.currentScore > this.highScore) {
        this.highScore = this.currentScore
        localStorage.setItem("high score", this.currentScore);
    }
  }
  wallCollided(wall, balloon){
    this.physics.add.collider(balloon, wall, () => {
        if (this.timeupSound) {
          this.timeupSound.stop();
        }
        this.time.delayedCall(200, () => {
          this.gameOverSound = this.sound.add("over");
          this.gameOverSound.play();
          this.gameOverSound.setVolume(1);
          this.scene.pause().launch("GameOverScene", { music: this.music, score: this.currentScore, highScore: this.highScore });
        })
      });
  }
  mobileUI(){
    if (window.innerWidth < 700) {
      this.menuBtn.setX(this.centerX * 0.3);
      this.scoreBoard.setX(this.centerX * 1.53);
      this.scoreText.setScale(0.78).setX(this.centerX * 1.17).setY(this.centerY * 1.78);
      this.hightRate = 1.8;
      this.balloonDelay = 300;
    }
  }
}
