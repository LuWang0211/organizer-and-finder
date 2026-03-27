import * as Phaser from "phaser";
import COLOR_MAP_9_SLICE_FRAGMENT_SHADER from "./shaders/colorMap9Slice.frag";

const FRAME_TEXTURE_KEY = "colormap-frame";
const MASK_TEXTURE_KEY = "colormap-mask";
const PANEL_TEXTURE_KEY = "colormap-panel";
const TILE_TEXTURE_KEY = "colormap-tile";
const FRAME_CANVAS_TEXTURE_KEY = "colormap-frame-canvas";
const MASK_CANVAS_TEXTURE_KEY = "colormap-mask-canvas";
const PANEL_CANVAS_TEXTURE_KEY = "colormap-panel-canvas";
const TILE_CANVAS_TEXTURE_KEY = "colormap-tile-canvas";
const COLOR_MAP_SHADER_KEY = "colormap-shader";

const FRAME_SRC = "/textures/advanced_frame.png";
const MASK_SRC = "/textures/advanced_frame_mask.png";
const PANEL_SRC = "/textures/panel_texture.png";
const TILE_SRC = "/textures/tile.png";
const FRAME_WIDTH = 253;
const FRAME_HEIGHT = 352;
const NINE_SLICE_INSETS = {
  leftWidth: 91,
  rightWidth: 103,
  topHeight: 100,
  bottomHeight: 103,
};

const COLOR_MAP_SHADER = new Phaser.Display.BaseShader(
  COLOR_MAP_SHADER_KEY,
  COLOR_MAP_9_SLICE_FRAGMENT_SHADER,
  undefined,
  {
    sourceSize: {
      type: "2f",
      value: { x: FRAME_WIDTH, y: FRAME_HEIGHT },
    },
    sliceInsets: {
      type: "4f",
      value: {
        x: NINE_SLICE_INSETS.leftWidth,
        y: NINE_SLICE_INSETS.topHeight,
        z: NINE_SLICE_INSETS.rightWidth,
        w: NINE_SLICE_INSETS.bottomHeight,
      },
    },
    outerColor: {
      type: "3f",
      value: { x: 0.1216, y: 0.6471, z: 1.0 },
    },
    panelTint: {
      type: "3f",
      value: { x: 0.9373, y: 0.2667, z: 0.2667 },
    },
    panelSourceBounds: {
      type: "4f",
      value: { x: 0, y: 0, z: 0, w: 0 },
    },
    panelScreenBounds: {
      type: "4f",
      value: { x: 0, y: 0, z: 0, w: 0 },
    },
    tileTextureSize: {
      type: "2f",
      value: { x: 64, y: 64 },
    },
  },
);

export type ColorMapFramePhaserSceneConfig = {
  frameColorHex: string;
  panelTintHex: string;
  previewWidth: number;
  previewHeight: number;
};

type PanelBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class ColorMapFramePhaserScene extends Phaser.Scene {
  private shaderOutput?: Phaser.GameObjects.Shader;
  private readonly frameColor: Phaser.Display.Color;
  private readonly panelTint: Phaser.Display.Color;
  private readonly previewWidth: number;
  private readonly previewHeight: number;
  private panelBounds: PanelBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  public constructor(config: ColorMapFramePhaserSceneConfig) {
    super("ColorMapFramePhaserScene");
    this.frameColor = Phaser.Display.Color.HexStringToColor(
      config.frameColorHex,
    );
    this.panelTint = Phaser.Display.Color.HexStringToColor(config.panelTintHex);
    this.previewWidth = config.previewWidth;
    this.previewHeight = config.previewHeight;
  }

  preload() {
    this.load.image(FRAME_TEXTURE_KEY, FRAME_SRC);
    this.load.image(MASK_TEXTURE_KEY, MASK_SRC);
    this.load.image(PANEL_TEXTURE_KEY, PANEL_SRC);
    this.load.image(TILE_TEXTURE_KEY, TILE_SRC);
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");
    this.createCanvasTexture(FRAME_TEXTURE_KEY, FRAME_CANVAS_TEXTURE_KEY);
    this.createMaskCanvasTexture();
    this.createCanvasTexture(PANEL_TEXTURE_KEY, PANEL_CANVAS_TEXTURE_KEY);
    this.createCanvasTexture(TILE_TEXTURE_KEY, TILE_CANVAS_TEXTURE_KEY);
    this.createShaderOutput();
    this.applyShaderUniforms();
    this.applyLayout();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.shaderOutput?.destroy();
      this.shaderOutput = undefined;
    });
  }

  private createCanvasTexture(sourceKey: string, targetKey: string) {
    const sourceImage = this.textures.get(sourceKey).getSourceImage() as
      | HTMLImageElement
      | HTMLCanvasElement;
    const textureWidth =
      "naturalWidth" in sourceImage
        ? sourceImage.naturalWidth
        : sourceImage.width;
    const textureHeight =
      "naturalHeight" in sourceImage
        ? sourceImage.naturalHeight
        : sourceImage.height;

    const canvasTexture = this.textures.createCanvas(
      targetKey,
      textureWidth,
      textureHeight,
    );
    if (!canvasTexture) {
      throw new Error(`Unable to create canvas texture: ${targetKey}`);
    }

    const context = canvasTexture.getContext();
    context.clearRect(0, 0, textureWidth, textureHeight);
    context.drawImage(sourceImage, 0, 0, textureWidth, textureHeight);
    canvasTexture.refresh();
    canvasTexture.setFilter(Phaser.Textures.LINEAR);
  }

  private createMaskCanvasTexture() {
    const sourceImage = this.textures.get(MASK_TEXTURE_KEY).getSourceImage() as
      | HTMLImageElement
      | HTMLCanvasElement;

    const canvasTexture = this.textures.createCanvas(
      MASK_CANVAS_TEXTURE_KEY,
      FRAME_WIDTH,
      FRAME_HEIGHT,
    );
    if (!canvasTexture) {
      throw new Error(
        `Unable to create canvas texture: ${MASK_CANVAS_TEXTURE_KEY}`,
      );
    }

    const context = canvasTexture.getContext();
    context.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
    context.drawImage(sourceImage, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);

    const maskData = context.getImageData(0, 0, FRAME_WIDTH, FRAME_HEIGHT).data;
    let minX = FRAME_WIDTH;
    let minY = FRAME_HEIGHT;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < FRAME_HEIGHT; y += 1) {
      for (let x = 0; x < FRAME_WIDTH; x += 1) {
        const index = (y * FRAME_WIDTH + x) * 4;
        if (maskData[index] > 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (maxX >= minX && maxY >= minY) {
      this.panelBounds = {
        x: minX / FRAME_WIDTH,
        y: minY / FRAME_HEIGHT,
        width: (maxX - minX + 1) / FRAME_WIDTH,
        height: (maxY - minY + 1) / FRAME_HEIGHT,
      };
    }

    canvasTexture.refresh();
    canvasTexture.setFilter(Phaser.Textures.LINEAR);
  }

  private createShaderOutput() {
    this.shaderOutput = this.add.shader(
      COLOR_MAP_SHADER,
      0,
      0,
      FRAME_WIDTH,
      FRAME_HEIGHT,
    );

    this.shaderOutput.setOrigin(0, 0);
    this.shaderOutput.setSampler2D("iChannel0", FRAME_CANVAS_TEXTURE_KEY, 0, {
      wrapS: "clamp_to_edge",
      wrapT: "clamp_to_edge",
      minFilter: "linear",
      magFilter: "linear",
    });
    this.shaderOutput.setSampler2D("iChannel1", MASK_CANVAS_TEXTURE_KEY, 1, {
      wrapS: "clamp_to_edge",
      wrapT: "clamp_to_edge",
      minFilter: "linear",
      magFilter: "linear",
    });
    this.shaderOutput.setSampler2D("iChannel2", PANEL_CANVAS_TEXTURE_KEY, 2, {
      wrapS: "clamp_to_edge",
      wrapT: "clamp_to_edge",
      minFilter: "linear",
      magFilter: "linear",
    });
    this.shaderOutput.setSampler2D("iChannel3", TILE_CANVAS_TEXTURE_KEY, 3, {
      wrapS: "clamp_to_edge",
      wrapT: "clamp_to_edge",
      minFilter: "linear",
      magFilter: "linear",
    });
  }

  private sourceAxisToScreenAxis(
    sourceCoord: number,
    screenSize: number,
    sourceSize: number,
    startInset: number,
    endInset: number,
  ) {
    const screenCenter = Math.max(screenSize - startInset - endInset, 1);
    const sourceCenter = Math.max(sourceSize - startInset - endInset, 1);

    if (sourceCoord < startInset) {
      return sourceCoord;
    }

    if (sourceCoord >= sourceSize - endInset) {
      return screenSize - (sourceSize - sourceCoord);
    }

    return (
      startInset + ((sourceCoord - startInset) / sourceCenter) * screenCenter
    );
  }

  private getStretchedPanelBounds(): PanelBounds {
    const sourceLeft = this.panelBounds.x * FRAME_WIDTH;
    const sourceTop = this.panelBounds.y * FRAME_HEIGHT;
    const sourceRight =
      (this.panelBounds.x + this.panelBounds.width) * FRAME_WIDTH;
    const sourceBottom =
      (this.panelBounds.y + this.panelBounds.height) * FRAME_HEIGHT;

    const screenLeft = this.sourceAxisToScreenAxis(
      sourceLeft,
      this.previewWidth,
      FRAME_WIDTH,
      NINE_SLICE_INSETS.leftWidth,
      NINE_SLICE_INSETS.rightWidth,
    );
    const screenTop = this.sourceAxisToScreenAxis(
      sourceTop,
      this.previewHeight,
      FRAME_HEIGHT,
      NINE_SLICE_INSETS.topHeight,
      NINE_SLICE_INSETS.bottomHeight,
    );
    const screenRight = this.sourceAxisToScreenAxis(
      sourceRight,
      this.previewWidth,
      FRAME_WIDTH,
      NINE_SLICE_INSETS.leftWidth,
      NINE_SLICE_INSETS.rightWidth,
    );
    const screenBottom = this.sourceAxisToScreenAxis(
      sourceBottom,
      this.previewHeight,
      FRAME_HEIGHT,
      NINE_SLICE_INSETS.topHeight,
      NINE_SLICE_INSETS.bottomHeight,
    );

    return {
      x: screenLeft / this.previewWidth,
      y: screenTop / this.previewHeight,
      width: Math.max(screenRight - screenLeft, 0) / this.previewWidth,
      height: Math.max(screenBottom - screenTop, 0) / this.previewHeight,
    };
  }

  private applyShaderUniforms() {
    if (!this.shaderOutput) {
      return;
    }

    const stretchedPanelBounds = this.getStretchedPanelBounds();

    this.shaderOutput.setUniform(
      "outerColor.value.x",
      this.frameColor.red / 255,
    );
    this.shaderOutput.setUniform(
      "outerColor.value.y",
      this.frameColor.green / 255,
    );
    this.shaderOutput.setUniform(
      "outerColor.value.z",
      this.frameColor.blue / 255,
    );
    this.shaderOutput.setUniform("panelTint.value.x", this.panelTint.red / 255);
    this.shaderOutput.setUniform(
      "panelTint.value.y",
      this.panelTint.green / 255,
    );
    this.shaderOutput.setUniform(
      "panelTint.value.z",
      this.panelTint.blue / 255,
    );

    const tileFrame = this.textures.getFrame(TILE_CANVAS_TEXTURE_KEY);
    if (tileFrame) {
      this.shaderOutput.setUniform("tileTextureSize.value.x", tileFrame.width);
      this.shaderOutput.setUniform("tileTextureSize.value.y", tileFrame.height);
    }

    this.shaderOutput.setUniform(
      "panelSourceBounds.value.x",
      this.panelBounds.x,
    );
    this.shaderOutput.setUniform(
      "panelSourceBounds.value.y",
      this.panelBounds.y,
    );
    this.shaderOutput.setUniform(
      "panelSourceBounds.value.z",
      this.panelBounds.width,
    );
    this.shaderOutput.setUniform(
      "panelSourceBounds.value.w",
      this.panelBounds.height,
    );
    this.shaderOutput.setUniform(
      "panelScreenBounds.value.x",
      stretchedPanelBounds.x,
    );
    this.shaderOutput.setUniform(
      "panelScreenBounds.value.y",
      stretchedPanelBounds.y,
    );
    this.shaderOutput.setUniform(
      "panelScreenBounds.value.z",
      stretchedPanelBounds.width,
    );
    this.shaderOutput.setUniform(
      "panelScreenBounds.value.w",
      stretchedPanelBounds.height,
    );
  }

  private applyLayout() {
    if (!this.shaderOutput) {
      return;
    }

    this.shaderOutput.setPosition(0, 0);
    this.shaderOutput.setSize(this.previewWidth, this.previewHeight);
    this.shaderOutput.setScale(1, 1);
    this.cameras.main.setSize(this.previewWidth, this.previewHeight);
  }
}
