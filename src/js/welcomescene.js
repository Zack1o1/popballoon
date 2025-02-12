
class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("WelcomeScene");
    this.highScoreLocal = localStorage.getItem("high score") || 0;
    this.music;
  }
  preload() {
    this.addAsset()
  }
  create(data){
    new MyImage(this, 400, 300, "bg").setScale(2);
    this.centerX = this.cameras.main.centerX;
    this.centerY = this.cameras.main.centerY;
    this.highScore = data?.highScore ?? this.highScoreLocal;
    this.setMusic();
    this.createUI();
  }
  loadAsset(key, src) {
    if (src.endsWith("svg")) {
      this.load.svg(key, src);
    } else if (src.endsWith("png")) {
      this.load.image(key, src);
    } else if (src.endsWith("mp3")) {
      this.load.audio(key, src);
    }
  }
  addAsset() {
    const assets = [
      { key: "ballon", src: "/src/asset/ballon.png" },
      { key: "balloon", src: "/src/asset/balloon.svg" },
      { key: "welcome", src: "/src/asset/welcome.svg" },
      { key: "highscore", src: "/src/asset/highscore.svg" },
      { key: "bg", src: "/src/asset/bg.png" },
      { key: "board", src: "/src/asset/board.svg" },
      { key: "btn", src: "/src/asset/btn.svg" },
      { key: "home", src: "/src/asset/home.svg" },
      { key: "what", src: "/src/asset/what.svg" },
      { key: "howtoplay", src: "/src/asset/howtoplay.svg" },
      { key: "menu", src: "/src/asset/menu.svg" },
      { key: "line", src: "/src/asset/line.svg" },
      { key: "playbtn", src: "/src/asset/playbtn.svg" },
      { key: "restart", src: "/src/asset/restart.svg" },
      { key: "playagain", src: "/src/asset/playagain.svg" },
      { key: "resume", src: "/src/asset/resume.svg" },
      { key: "rules", src: "/src/asset/rules.svg" },
      { key: "timer", src: "/src/asset/timer.svg" },
      { key: "volumeOn", src: "/src/asset/musicOn.svg" },
      { key: "volumeOff", src: "/src/asset/musicOff.svg" },
      { key: "music", src: "/src/asset/audio/gameMusic.mp3" },
      { key: "pop", src: "/src/asset/audio/popBallon.mp3" },
      { key: "over", src: "/src/asset/audio/gameOver.mp3" },
      { key: "timeup", src: "/src/asset/audio/notime.mp3" },
    ];
    assets.forEach((asset) => this.loadAsset(asset.key, asset.src));
  }
  createUI(){
    this.welcomeBoard()
    this.highScoreBoard()
    this.volumeButton()
    this.playButton()
    this.howToPlayBoard()
    this.mobileUI()
  }
  setMusic(){
    this.music = this.sound.add("music");
    this.music.play();
    this.music.setDetune(-800);
  }
  welcomeBoard(){
    const welcomeConfig = {
        x: this.centerX,
        y: this.centerY - 80,
        image: "welcome",
        scale: getScale(250),
      }
    new MyImage(this, welcomeConfig.x, welcomeConfig.y, welcomeConfig.image).setScale((welcomeConfig.scale));
  }
  highScoreBoard(){
    const highScoreConfig = {
        x: this.centerX - 2,
        y: this.centerY - 165,
        image: "highscore",
        scale: getScale(250),
        _: {
          x: this.centerX - 88,
          y: this.centerY - 180,
          text: `High Score: ${this.highScore.toString().padStart(3, "0")}`,
          fontSize: 24,
          color: "#ffffff"
        }
      }
      this.highscoreBoard_ = new MyImage(this, highScoreConfig.x, highScoreConfig.y, highScoreConfig.image).setScale((highScoreConfig.scale));
      this.highscoreConfigText = new MyText(this, highScoreConfig._.x, highScoreConfig._.y, highScoreConfig._.text, highScoreConfig._.fontSize, highScoreConfig._.color)
  }
  howToPlayBoard(){
    const howtoplayConfig = {
        x: this.centerX + 300,
        y: this.centerY + 200,
        image: "howtoplay",
        scale: getScale(250),
        _: {
          x: this.centerX + 290,
          y: this.centerY + 115,
          image: "rules",
          scale: getScale(250)
        }
      }
      this.rulesBtn = new MyImage(this, howtoplayConfig.x, howtoplayConfig.y, howtoplayConfig.image).setScale((howtoplayConfig.scale));
      this.rules = new MyImage(this, howtoplayConfig._.x, howtoplayConfig._.y, howtoplayConfig._.image).setScale((howtoplayConfig._.scale));
      this.rules.setVisible(false)
      this.rulesBtn
        .setInteractive()
        .on("pointerover", () => {
            this.rules.setVisible(true)
        })
        .on("pointerout", () => {
            this.time.delayedCall(1000, () => {
            this.rules.setVisible(false)
            })
        })
  }
  volumeButton(){
    const volumeConfig = {
        x: this.centerX,
        y: this.centerY + 23,
        image: "volumeOn",
        image_: "volumeOff",
        scale: getScale(220),
      }
      window.innerWidth < 700 ?
      new VolumeControl(this, volumeConfig.x, volumeConfig.y - 35, volumeConfig.scale, this.music) :
      new VolumeControl(this, volumeConfig.x, volumeConfig.y, volumeConfig.scale, this.music)
  }
  playButton(){
    const playBtnConfig = {
        x: this.centerX,
        y: this.centerY + 180,
        image: "playbtn",
        scale: getScale(250),
      }
    this.startBtn = new MyImage(this, playBtnConfig.x, playBtnConfig.y, playBtnConfig.image)
    .setScale((playBtnConfig.scale))
    .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("GameScene", { highScore: this.highScoreLocal, music: this.music });
        new MyImage(this, 400, 300, "bg").setScale(2);
      })
  }
  mobileUI(){
    if(window.innerWidth < 700){
        this.highscoreBoard_.setY(this.centerY / 1.9)
        this.highscoreConfigText.setFontSize(16).setY(this.centerY / 1.98).setX(this.centerX / 1.45)
        this.startBtn.setY(this.centerY + 80)
        this.rulesBtn.setY(this.centerY + 250).setX(this.centerX).setScale(0.5)
        this.rules.setY(this.centerY + 170).setX(this.centerX - 10).setScale(0.5)
    }
  }
}
