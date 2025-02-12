class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }
    create(data) {
        new MyImage(this, 400, 300, "bg").setScale(2);
        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;
        this.music = data?.music;
        this.score = data?.score ?? this.score;
        this.highscore = data?.highScore ?? this.score;
        this.createUI();
    }
    createUI() {
        this.createBoard();
        this.createScoreBtn();
        this.createPlayAgainBtn();
        this.createVolumeBtn();
        this.createHomeBtn();
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
    createScoreBtn() {
        const scoreBtnConfig = {
            x: this.centerX,
            y: this.centerY - 84,
            image: "btn",
            scale: getScale(200),
            _: {
                x: this.centerX - 70,
                y: this.centerY - 100,
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
    createPlayAgainBtn() {
        const playAgainConfig = {
            x: this.centerX,
            y: this.centerY - 20,
            image: "playagain",
            scale: getScale(200),
        };
        this.playAgainBtn = new MyImage(
            this,
            playAgainConfig.x,
            playAgainConfig.y,
            playAgainConfig.image
        ).setScale(playAgainConfig.scale);
    }
    createVolumeBtn() {
        const volumeConfig = {
            x: this.centerX - 40,
            y: this.centerY + 60,
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
    createHomeBtn() {
        const homeConfig = {
            x: this.centerX + 20,
            y: this.centerY + 60,
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
    playAgainGame() {
        this.score = 0;
        this.scene.stop("GameOverScene");
        this.scene.stop("GameScene");
        this.scene.start("GameScene");
      }
    homeScreen() {
        this.score = 0;
        this.music.stop();
        this.scene.stop("GameOverScene");
        this.scene.stop("GameScene");
        this.scene.start("WelcomeScene", { highScore: this.highscore });
    }
    setFunctionality() {
        this.playAgainBtn.setInteractive().on("pointerdown", () => this.playAgainGame());
        this.homeBtn.setInteractive().on("pointerdown", () => this.homeScreen());
      }
}
