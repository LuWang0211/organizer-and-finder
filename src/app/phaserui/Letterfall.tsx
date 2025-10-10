export function createLetterFall(scene: Phaser.Scene, text: string) {
  const textArray = text.split("");
  const start = Phaser.Math.Between(0, 800);

  const letterArray = textArray.map((letter, index) => {
    const x = start + index * 50 + Phaser.Math.Between(-10, 10);
    const y = -20 + Phaser.Math.Between(-10, 10);
    new LetterFallControl(scene, x, y, letter);
  });
  return letterArray;
}

type TextWithPhysicsBody = Phaser.GameObjects.Text & {
  body: Phaser.Physics.Arcade.Body;
};

class LetterFallControl {
  private text: TextWithPhysicsBody;

  public constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    this.text = scene.add.text(x, y, text, {
      fontSize: "32px",
      stroke: "#000",
    }) as TextWithPhysicsBody;

    // add physics to the text assign gravity
    scene.physics.add.existing(this.text);

    this.text.body.setSize(this.text.width, this.text.height);
    this.text.body.allowGravity = true;
    this.text.body.setMass(0.1);
    this.text.body.collideWorldBounds = false;

    scene.events.on("update", this.update, this);
  }

  update() {
    if (this.text.y > 800) {
      this.text.destroy();
    }
  }
}
