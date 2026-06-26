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

export type ColorMapFramePhaserSceneConfig = {
  frameColorHex: string;
  panelTintHex: string;
  previewWidth: number;
  previewHeight: number;
};

type PanelBounds = {
  x: number;
  /** Bottom-origin normalized Y coordinate. */
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
        y: (FRAME_HEIGHT - maxY - 1) / FRAME_HEIGHT,
        width: (maxX - minX + 1) / FRAME_WIDTH,
        height: (maxY - minY + 1) / FRAME_HEIGHT,
      };
    }

    canvasTexture.refresh();
    canvasTexture.setFilter(Phaser.Textures.LINEAR);
  }

  private createShaderOutput() {
    const shaderConfig: Phaser.Types.GameObjects.Shader.ShaderQuadConfig = {
      name: COLOR_MAP_SHADER_KEY,
      shaderName: COLOR_MAP_SHADER_KEY,
      fragmentSource: COLOR_MAP_9_SLICE_FRAGMENT_SHADER,
      setupUniforms: (setUniform: (name: string, value: unknown) => void) => {
        const uniforms = this.getShaderUniforms();
        for (const [name, value] of Object.entries(uniforms)) {
          setUniform(name, value);
        }
      },
    };

    this.shaderOutput = this.add.shader(
      shaderConfig,
      0,
      0,
      FRAME_WIDTH,
      FRAME_HEIGHT,
      [
        FRAME_CANVAS_TEXTURE_KEY,
        MASK_CANVAS_TEXTURE_KEY,
        PANEL_CANVAS_TEXTURE_KEY,
        TILE_CANVAS_TEXTURE_KEY,
      ],
    );

    this.shaderOutput.setOrigin(0, 0);
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
    const sourceBottom = this.panelBounds.y * FRAME_HEIGHT;
    const sourceRight =
      (this.panelBounds.x + this.panelBounds.width) * FRAME_WIDTH;
    const sourceTop =
      (this.panelBounds.y + this.panelBounds.height) * FRAME_HEIGHT;

    const screenLeft = this.sourceAxisToScreenAxis(
      sourceLeft,
      this.previewWidth,
      FRAME_WIDTH,
      NINE_SLICE_INSETS.leftWidth,
      NINE_SLICE_INSETS.rightWidth,
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
      NINE_SLICE_INSETS.bottomHeight,
      NINE_SLICE_INSETS.topHeight,
    );
    const screenTop = this.sourceAxisToScreenAxis(
      sourceTop,
      this.previewHeight,
      FRAME_HEIGHT,
      NINE_SLICE_INSETS.bottomHeight,
      NINE_SLICE_INSETS.topHeight,
    );

    return {
      x: screenLeft / this.previewWidth,
      y: screenBottom / this.previewHeight,
      width: Math.max(screenRight - screenLeft, 0) / this.previewWidth,
      height: Math.max(screenTop - screenBottom, 0) / this.previewHeight,
    };
  }

  private getShaderUniforms(): Record<string, number | number[]> {
    const stretchedPanelBounds = this.getStretchedPanelBounds();

    const tileFrame = this.textures.getFrame(TILE_CANVAS_TEXTURE_KEY);

    return {
      iChannel0: 0,
      iChannel1: 1,
      iChannel2: 2,
      iChannel3: 3,
      resolution: [this.previewWidth, this.previewHeight],
      sourceSize: [FRAME_WIDTH, FRAME_HEIGHT],
      sliceInsets: [
        NINE_SLICE_INSETS.leftWidth,
        NINE_SLICE_INSETS.bottomHeight,
        NINE_SLICE_INSETS.rightWidth,
        NINE_SLICE_INSETS.topHeight,
      ],
      outerColor: [
        this.frameColor.red / 255,
        this.frameColor.green / 255,
        this.frameColor.blue / 255,
      ],
      panelTint: [
        this.panelTint.red / 255,
        this.panelTint.green / 255,
        this.panelTint.blue / 255,
      ],
      panelSourceBounds: [
        this.panelBounds.x,
        this.panelBounds.y,
        this.panelBounds.width,
        this.panelBounds.height,
      ],
      panelScreenBounds: [
        stretchedPanelBounds.x,
        stretchedPanelBounds.y,
        stretchedPanelBounds.width,
        stretchedPanelBounds.height,
      ],
      tileTextureSize: [tileFrame?.width ?? 64, tileFrame?.height ?? 64],
    };
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
