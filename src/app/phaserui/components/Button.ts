export class Button {
  text: string;
  private scene: Phaser.Scene;
  private _gameObject: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, text: string) {
    this.scene = scene;
    this.text = text;

    this._gameObject = this.create();
  }

  create() {
    const button = this.scene.add
      .text(0, 0, this.text, {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        fixedWidth: 260,
        backgroundColor: "#2d2d2d",
      })
      .setPadding(10)
      .setOrigin(0.5);

    button.setInteractive({ useHandCursor: true });

    button.on("pointerover", () => {
      button.setBackgroundColor("#8d8d8d");
    });

    button.on("pointerout", () => {
      button.setBackgroundColor("#2d2d2d");
    });

    return button;
  }

  public get gameObject() {
    return this._gameObject;
  }

  addClickListner(callback: () => void, context?: any) {
    this._gameObject.on("pointerup", callback, context);
  }
}
