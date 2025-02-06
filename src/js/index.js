let score = 0;
let gameTime = 60;
let balloonGravity = -20;
const sceneContainer = document.querySelector(".scene");
let highScoreLocal = localStorage.getItem("high score") || 0;

if((highScoreLocal) < 10){
  highScoreLocal = `00${highScoreLocal}`;
}
else if((highScoreLocal) < 100){
  highScoreLocal = `0${highScoreLocal}`;
}
let music;
const volume = {
  x: 30,
  y: 494,
}
class WelcomeScene extends Phaser.Scene{
    constructor() {
        super("WelcomeScene")
        let highScoreTxt;
    }
    preload(){
      this.load.image("ballon", "/src/asset/balloon.png");
      this.load.svg("volumeOn", "/src/asset/icon/volumeUp.svg");
      this.load.svg("volumeOff", "/src/asset/icon/volumeMute.svg");
      this.load.audio("music", "/src/asset/audio/gameMusic.mp3");
      this.load.audio("pop", "/src/asset/audio/popBallon.mp3");
      this.load.audio("over", "/src/asset/audio/gameOver.mp3");
      this.load.audio("timeup", "/src/asset/audio/notime.mp3");

    }
    create(){
            const title = {
              x: 410,
              y: 45,
              text: "Welcome To",
              fontSize: 80,
              color: "#dddddd",
              _: {
                x: 280,
                y: 130,
                text: "POP THE BALLOON",
                fontSize: 80,
                color: "#dddddd",
              }
            }
            const rules = {
              x: 1150,
              y: 488,
              text: "How to Play?",
              fontSize: 20,
              color: "#ffffff",
              _: {
                x: 950,
                y: 420,
                fontSize: 17,
                color: "#16cc34",
                text: "Avoid touching the above wall! Pop the balloons and keep going for a high score",
              }
            }
            const highScore = {
              x: 500,
              y: 250,
              text: `High Score: ${highScoreLocal}`,
              fontSize: 40,
              color: "#16cc34",
              delay: {
                delay: 1000,
                alpha: { from: 0, to: 1 } 
              }
            }
            const button = {
              image: "ballon",
              x: 650,
              y: 425,
              scale: 0.13,
              tint: 0x777777,
              _: {
                text: "Start",
                x: 603,
                y: 366,
                fontSize: 40,
                color: "#eeeeee",
                delay:{
                  delay: 800,
                  alpha: { from: 0, to: 1 } 
                }
              }
            }
            const addAnimation = (element, y, options = {})=>{
              this.tweens.add({
                targets: element,
                y: y,
                duration:800,
                ease: "Sine",
                ...options
              })
            }
            
            music = this.sound.add("music");
            music.play();
            music.setDetune(-800);
            new MyText(this, title.x, title.y, title.text, title.fontSize, title.color);
            new MyText(this, title._.x, title._.y, title._.text, title._.fontSize, title._.color);
            this.highScoreTxt = new MyText(this, highScore.x, highScore.y, highScore.text, highScore.fontSize, highScore.color);
            this.highScoreTxt.setAlpha(0);
            addAnimation(this.highScoreTxt, highScore.y, highScore.delay);

            let startButton = new MyImage(this, button.x, 1000, button.image).setInteractive();
            startButton.setScale(button.scale).setTint(button.tint);
            let startText = new MyText(this, button._.x, 320, button._.text, button._.fontSize, button._.color);
            startText.setAlpha(0);
            addAnimation(startButton, button.y);
            addAnimation(startText, button._.y, button._.delay);

            

            startButton.on("pointerdown", (e)=>{
              addAnimation(startButton, (button.y + 50));
              addAnimation(startText, (button._.y + 50));
              this.input.setDefaultCursor('default');
              this.scene.start("GameScene");
            })
            startButton.on("pointerup", (e)=>{
              addAnimation(startButton, button.y);
              addAnimation(startText, (button._.y));
            })
            addHover(this, startButton);
            addHover(this, startText);

            new VolumeControl(this, volume.x, volume.y, music);
            
            let howToplayText = new MyText(this, rules.x, rules.y, rules.text, rules.fontSize, rules.color).setInteractive();
            addHover(this, howToplayText);
            let description = new MyText(this, rules._.x, rules._.y, rules._.text, rules._.fontSize, rules._.color)
            description
            .setStyle({wordWrap: {
              width: 255,
              useAdvanceWrap: true,
            }})
            .setAlpha(0);
            howToplayText.on("pointerover", ()=>{
              description.setAlpha(1);
            });
            howToplayText.on("pointerout", ()=>{
              this.time.delayedCall(500, ()=>{
                description.setAlpha(0);
              })
            })
    }


}
class GameScene extends Phaser.Scene{
    constructor(){
      super("GameScene");

    }
    create(data){
      this.totalTime = data?.t ?? gameTime;
      music.setVolume(0.1);
      const menu = {
        x: 20,
        y: 480,
        text: "Menu",
        fontSize: 30,
        color: "#ffffff"
      }
      const scoreConfig = {
        x: 1110,
        y: 480,
        text:  `Score: 000`,
        fontSize: 30,
        color: "#ffffff"
      }

      
      this.time.delayedCall(1000, ()=>{
        this.timer = this.time.addEvent({
          delay: 1000,
          callback: this.updateTimer,
          callbackScope: this,
          loop: true,
        });
      })
      this.timeText = new MyText(this, 600, 20, this.totalTime, 30);
      let circle = this.add.circle(618, 38, 30, );
      circle.setFillStyle( "0xffffff", 1);
      this.timeText.setDepth(11);
      circle.setDepth(10);
      
      this.scoreText = new MyText(this, scoreConfig.x, scoreConfig.y, scoreConfig.text, scoreConfig.fontSize, scoreConfig.color);
      
      let menuBtn = new MyText(this, menu.x, menu.y, menu.text, menu.fontSize, menu.color).setInteractive();
      addHover(this, menuBtn);
      menuBtn.on("pointerdown", ()=>{
        this.scene.pause("GameScene").launch("PauseScene", { t: this.totalTime});
      })
      
      
      this.balloons = this.physics.add.group();
      
      this.balloonApear = this.time.addEvent({
        delay: 400, 
        callback: this.spawnBalloon,
        callbackScope: this,
        loop: true,
      });
      this.add.rectangle(0, 0, 1400, 75, "0x000000").setScale(2).setDepth(9)
      this.wall = this.add.rectangle(0, 0, 1400, 30, "0x000000").setScale(2);
      this.wall.setDepth(9);
      this.physics.add.existing(this.wall);
      this.wall.body.setImmovable(true);
      this.wall.body.setAllowGravity(false);
      let line = this.add.line(0, 0, 0, 76, 5000, 76, 0xffffff);
      line.setDepth(9);

     

  }
  spawnBalloon() {
    
    const balloonSize = 100;
    const spawnArea = { x: 120, y: 600, width: 900, height: 480 };
    let x, y, balloon;
    const isOverlap = (x, y) => {
      const newBalloonBounds = new Phaser.Geom.Rectangle(x - balloonSize / 2, y - balloonSize / 2, balloonSize, balloonSize);
      return this.balloons.getChildren().some(existingBalloon => Phaser.Geom.Intersects.RectangleToRectangle(newBalloonBounds, existingBalloon.getBounds()));
    };
  
    do {
      x = Phaser.Math.Between(spawnArea.x, spawnArea.x + spawnArea.width);
      y = Phaser.Math.Between(spawnArea.y, spawnArea.y + spawnArea.height);
    } while (isOverlap(x, y));
  
    balloon = this.balloons.create(x, y, "ballon");
    balloon.setScale(0.1).setInteractive();
    balloon.on("pointerdown", () => {
      this.popBalloon = this.sound.add("pop");
      this.popBalloon.play();
      this.popBalloon.setVolume(1);
      balloon.destroy();
      score += 10;
      this.scoreText.setText(score < 100 ? `Score: 0${score}` : `Score: ${score}`)
      if(score > Number(highScoreLocal)) {
        localStorage.setItem("high score", score);
        highScoreLocal = score;
      }
    });
    this.physics.add.collider(balloon, this.wall, () => {
      if(this.timeup){
          this.timeup.stop();
      }
      this.time.delayedCall(500, ()=>{
        this.gameOver = this.sound.add("over");
        this.gameOver.play();
        this.gameOver.setVolume(1);
        this.scene.pause().launch("GameOverScene");
      })
    });

  }
    updateTimer(){
      this.totalTime--;
      this.timeText.setText(this.totalTime < 10 ? `0${this.totalTime}` : this.totalTime);
      if(this.totalTime > 2 && this.totalTime <= 10){
        this.timeup = this.sound.add("timeup");
        this.timeup.play();
        this.timeup.setVolume(1);
      }
      if(this.totalTime <= 0) {
        this.gameOver = this.sound.add("over");
        this.gameOver.play();
        this.gameOver.setVolume(1);
        this.timer.remove();
        this.balloonApear.remove();
        this.scene.pause().launch("GameOverScene");
      }
      
    }
}
class PauseScene extends Phaser.Scene{
  constructor(){
    super("PauseScene");
  }
  create(data){
    this.totalTime = data.t
    music.setVolume(1)
    music.play()
    console.log(this.totalTime)
    const menuBar = {
      x: 550,
      y: 180,
      fontSize: 48,
      color: "#ffffff",
      
    }
    
    let resume = new MyText(this, menuBar.x, menuBar.y, "Resume", menuBar.fontSize, menuBar.color).setInteractive();
    addHover(this, resume)
    resume.on("pointerdown", ()=>{
      this.scene.stop("PauseScene").resume("GameScene");
      music.setVolume(0.1);
    })
    let reset = new MyText(this, menuBar.x, (menuBar.y + 55), "Restart", menuBar.fontSize, menuBar.color).setInteractive();
    addHover(this, reset);
    reset.on("pointerdown", ()=>{
      score = 0;
      this.scene.stop("PauseScene");
      this.scene.stop("GameScene");
      this.scene.start("GameScene", { t: gameTime});
    })
    let exit = new MyText(this, menuBar.x + 30, (menuBar.y + (55 * 2)), "Exit", menuBar.fontSize, menuBar.color).setInteractive();
    addHover(this, exit);
    exit.on("pointerdown", ()=>{
      score = 0;
      this.scene.stop("PauseScene");
      this.scene.stop("GameScene");
      music.stop();
      this.scene.start("WelcomeScene");
    })
    new VolumeControl(this, volume.x + 30, volume.y - 40, music);
  }
}
class GameOverScene extends Phaser.Scene{
  constructor(){
    super("GameOverScene");
  }
  create(){
    this.scoreText = new MyText(this, 550, 180, `Score: ${score}`, 48, "#ffffff");
    this.playAgain = new MyText(this, 550, 240, `Play Again`, 48, "#ffffff").setInteractive();
    addHover(this,this.playAgain);
    this.playAgain.on("pointerdown", ()=>{
      score = 0;
      this.scene.stop("GameOverScene");
      this.scene.stop("GameScene");
      this.scene.start("GameScene", { t: 60});
    })
    this.exit = new MyText(this, 560, 300, `Home`, 48, "#ffffff").setInteractive();
    addHover(this,this.exit);
    this.exit.on("pointerdown", ()=>{
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
    width: 1280,
    height: 520,
    scene: [ WelcomeScene, GameScene, PauseScene, GameOverScene],
    backgroundColor: '#020a05',
    // transparent: true,
    parent: sceneContainer,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: balloonGravity },
        debug: false, 
      },
    }
  };
  
  const game = new Phaser.Game(config);
  
  const addHover = (scene, element) => {
    element.on("pointerover", () => {
      element.setAlpha(0.8);
      scene.input.setDefaultCursor('pointer');
    });
  
    element.on("pointerout", () => {
      element.setAlpha(1);
      scene.input.setDefaultCursor('default');
    });
  };
  class MyText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, fontSiz = 48, color="#000", options = {}) {
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
    constructor(scene, x, y, music) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.music = music;
  
      
      this.volumeOn = new MyImage(scene, x, y, "volumeOn").setInteractive();
      this.volumeOff = new MyImage(scene, x, y, "volumeOff").setInteractive();
      
      this.volumeOff.setVisible(false);
      this.music.setLoop(true);
  
      addHover(scene, this.volumeOn);
      addHover(scene, this.volumeOff);
  
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
  
