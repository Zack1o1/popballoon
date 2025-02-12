
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
    };
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

    this.volumeOn = new MyImage(scene, x, y, "volumeOn")
      .setScale(scale)
      .setInteractive()
      .setFlipX(true);
    this.volumeOff = new MyImage(scene, x, y, "volumeOff")
      .setScale(scale)
      .setInteractive()
      .setFlipX(true);

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

