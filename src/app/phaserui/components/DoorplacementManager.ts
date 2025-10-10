import { includes } from "lodash";
import type { FloorPlanScene } from "@/app/phaserui/scenes/FloorPlanScene";

const DEBUG = false;

export class DoorplacementManager {
  scene: FloorPlanScene;

  private doorRailStrokes: Phaser.GameObjects.Graphics | undefined;
  private _doorPlacementRailsGroup: Phaser.GameObjects.Group | undefined;

  constructor(scene: FloorPlanScene) {
    this.scene = scene;

    this.create();
  }

  create() {
    this._doorPlacementRailsGroup = this.scene.add.group();

    this.scene.input.on(
      "dragstart",
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.GameObject,
      ) => {
        if (!includes(this.scene.doors, gameObject)) {
          return;
        }

        this.scene.children.bringToTop(gameObject);
      },
      this,
    );

    this.scene.input.on(
      "drag",
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Rectangle,
        dragX: number,
        dragY: number,
      ) => {
        if (!includes(this.scene.doors, gameObject)) {
          return;
        }

        const gameObjectRect = gameObject.getBounds();

        // Test if gameobject intersects with _doorPlacementRailsGroup
        const intersectLines =
          this._doorPlacementRailsGroup!.getChildren().filter((sprite) => {
            const bounds = (sprite as Phaser.GameObjects.Zone).getBounds();

            return Phaser.Geom.Intersects.RectangleToRectangle(
              gameObjectRect,
              bounds,
            );
          });

        gameObject.x = dragX;
        gameObject.y = dragY;

        if (intersectLines.length === 1) {
          // If there is only one intersecting line, snap the door to it
          const intersectLine = intersectLines[0] as Phaser.GameObjects.Zone;
          const line = intersectLine.data.get("line") as Phaser.Geom.Line;
          const isHorizontal = intersectLine.data.get(
            "isHorizontal",
          ) as boolean;

          if (isHorizontal) {
            gameObject.y = line.y1;
            gameObject.setAngle(90);
          } else {
            gameObject.x = line.x1;
            gameObject.setAngle(0);
          }
        }
      },
    );
  }

  public onFloorPlanContourChanged(mergedLines: Phaser.Geom.Line[]) {
    if (DEBUG) {
      if (!this.doorRailStrokes) {
        this.doorRailStrokes = this.scene.add.graphics({
          lineStyle: { width: 2, color: 0x00ff00 },
        });
      } else {
        this.doorRailStrokes.clear();
      }
      mergedLines.forEach((line) => {
        this.doorRailStrokes!.strokeLineShape(line);
      });
    }

    this._doorPlacementRailsGroup!.clear(true, true);

    mergedLines.forEach((line) => {
      const { x1, y1, x2, y2 } = line;
      const isHorizontal = y1 === y2;

      let zone: Phaser.GameObjects.Zone;

      if (isHorizontal) {
        const width = x2 - x1;
        zone = this.scene.add.zone(x1 + width / 2, y1, x2 - x1, 3);
      } else {
        const height = y2 - y1;
        zone = this.scene.add.zone(x1, y1 + height / 2, 3, y2 - y1);
      }
      zone.depth = 60;
      this._doorPlacementRailsGroup!.add(zone);
      zone.setData("line", line);
      zone.setData("isHorizontal", isHorizontal);

      return;
    });
  }
}
