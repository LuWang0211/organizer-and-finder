import * as Phaser from "phaser";

export interface HTMLInputTextConfig {
  width?: number;
  height?: number;
  text?: string;
  fontSize?: string;
  color?: string;
  align?: "left" | "center" | "right";
  placeholder?: string;
}

export class HTMLInputText extends Phaser.GameObjects.Rectangle {
  private inputElement!: HTMLInputElement;
  private wrapper!: HTMLDivElement;
  private callbacks = new Map<string, (input: HTMLInputText) => void>();

  private _lastX = -9999;
  private _lastY = -9999;

  constructor(scene: Phaser.Scene, config: HTMLInputTextConfig = {}) {
    super(scene, 0, 0, config.width ?? 200, config.height ?? 40, 0x000000, 0);

    this.initDOM();
    this.applyConfig(config);

    scene.events.on("update", this.update, this);
    scene.game.events.once("destroy", this.destroy, this);
  }

  private applyConfig(config: HTMLInputTextConfig): void {
    if (config.width !== undefined) {
      this.inputElement.style.width = `${config.width}px`;
    }
    if (config.height !== undefined) {
      this.inputElement.style.height = `${config.height}px`;
    }
    if (config.fontSize) {
      this.inputElement.style.fontSize = config.fontSize;
    }
    if (config.color) {
      this.inputElement.style.color = config.color;
    }
    if (config.align) {
      this.inputElement.style.textAlign = config.align;
    }
    if (config.placeholder) {
      this.inputElement.placeholder = config.placeholder;
    }
    if (config.text) {
      this.inputElement.value = config.text;
    }

    this.inputElement.style.transform = "translate(-50%, 0)";
  }

  private initDOM(): void {
    const canvas = this.scene.sys.game.canvas;
    const rect = canvas.getBoundingClientRect();

    this.wrapper = document.createElement("div");
    this.wrapper.style.position = "absolute";
    this.wrapper.style.pointerEvents = "none";
    this.wrapper.style.overflow = "hidden";
    this.wrapper.style.left = `${rect.left}px`;
    this.wrapper.style.top = `${rect.top}px`;
    this.wrapper.style.width = `${rect.width}px`;
    this.wrapper.style.height = `${rect.height}px`;
    document.body.appendChild(this.wrapper);

    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";
    this.inputElement.style.position = "absolute";
    this.inputElement.style.pointerEvents = "auto";
    this.inputElement.style.border = "none";
    this.inputElement.style.background = "transparent";
    this.inputElement.style.outline = "none";
    this.inputElement.style.padding = "0";
    this.inputElement.style.margin = "0";
    this.inputElement.style.fontFamily = "sans-serif";
    this.inputElement.style.left = "0px";
    this.inputElement.style.top = "0px";

    this.wrapper.appendChild(this.inputElement);
  }

  update(): void {
    const px = this.x;
    const py = this.y;

    if (px !== this._lastX || py !== this._lastY) {
      this._lastX = px;
      this._lastY = py;

      const point = new Phaser.Math.Vector2();
      const canvas = this.scene.sys.game.canvas;
      const rect = canvas.getBoundingClientRect();
      const scale = this.scene.scale;

      this.getWorldTransformMatrix().transformPoint(px, py, point);

      this.inputElement.style.left = `${rect.left + point.x / scale.displayScale.x}px`;
      this.inputElement.style.top = `${rect.top + point.y / scale.displayScale.y}px`;
    }
  }

  get text(): string {
    return this.inputElement.value;
  }

  set text(value: string) {
    this.inputElement.value = value;
  }

  onTextChange(callback: (input: HTMLInputText) => void): this {
    this.inputElement.addEventListener("input", () => {
      callback(this);
    });
    this.callbacks.set("textchange", callback);
    return this;
  }

  override destroy(fromScene?: boolean): void {
    this.scene.events.off("update", this.update, this);
    this.scene.game.events.off("destroy", this.destroy, this);
    this.wrapper?.remove();
    super.destroy(fromScene);
  }
}
