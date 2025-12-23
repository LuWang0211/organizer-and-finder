import { bind, flatten, pick } from "lodash";
import { Button } from "@/app/phaserui/components/Button";
import { Hallway, Room } from "@/app/phaserui/components/Room";
import { mergeLines } from "@/utils/geometry";
import { DoorplacementManager } from "../components/DoorplacementManager";
import { OnFloorPlanContourChanged } from "../components/events";

export class FloorPlanScene extends Phaser.Scene {
  constructor() {
    super("FloorPlanScene");
  }

  private rooms: Room[] = [];
  private _doors: Phaser.GameObjects.Rectangle[] = [];

  private _doorplacementManager: DoorplacementManager | undefined;

  public get doors() {
    return this._doors;
  }

  start() {
    const sizer = this.rexUI.add.sizer({
      orientation: 0,
      x: 0,
      y: 0,
      anchor: {
        top: "top+20",
        centerX: "center",
        width: "90%",
      },
      space: {
        item: 20,
      },
    });

    sizer.addSpace();
    const buttonAddRoom = new Button(this, "Add a Room");
    sizer.add(buttonAddRoom.gameObject);

    const buttonAddHallway = new Button(this, "Add a Hallway");
    sizer.add(buttonAddHallway.gameObject);

    const buttonAddDoor = new Button(this, "Add a Door");
    sizer.add(buttonAddDoor.gameObject);

    const buttonSaveJson = new Button(this, "Save as Json");
    sizer.add(buttonSaveJson.gameObject);
    sizer.addSpace();

    sizer.layout();

    buttonAddRoom.gameObject.depth = 200;
    buttonAddHallway.gameObject.depth = 200;
    buttonAddDoor.gameObject.depth = 200;

    buttonAddRoom.addClickListner(this.addRoom, this);
    buttonAddHallway.addClickListner(this.addHallway, this);
    buttonAddDoor.addClickListner(this.addDoor, this);
    buttonSaveJson.addClickListner(this.onSaveJson, this);

    this._doorplacementManager = new DoorplacementManager(this);

    // Listen to room resize events
    this.events.on(
      OnFloorPlanContourChanged,
      this._doorplacementManager.onFloorPlanContourChanged,
      this._doorplacementManager,
    );
  }

  addRoom() {
    const color = new Phaser.Display.Color();
    this.rooms.push(
      new Room(this, color.random().color, bind(this.onRoomResize, this)),
    );
  }

  addHallway() {
    this.rooms.push(new Hallway(this, bind(this.onRoomResize, this)));
  }

  addDoor() {
    const door = this.add.rectangle(0, 0, 30, 60, 0x00ff00);
    door.setInteractive({ draggable: true });
    this._doors.push(door);
  }

  onRoomResize() {
    const lines = flatten(this.rooms.map((room) => room.lines));

    const mergedLines = mergeLines(lines);

    this.events.emit(OnFloorPlanContourChanged, mergedLines);
  }

  onSaveJson() {
    const fileContent = JSON.stringify(
      {
        rooms: this.rooms.map((room) => room.serialize()),
        doors: this.doors.map((door) =>
          pick(door.getBounds(), ["x", "y", "width", "height"]),
        ),
      },
      null,
      2,
    );
    const blob = new Blob([fileContent], { type: "application/json" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a download link and set the filename
    let a: HTMLAnchorElement | null = document.createElement("a");
    a.href = url;
    a.download = "floorplan.json";

    // Trigger the download by clicking the link
    a.click();

    // Clean up by revoking the object URL
    URL.revokeObjectURL(url);

    // Recycle the <a> element (optional but good practice)
    a.remove(); // Since the element was not added to the DOM, this is optional
    a = null; // Explicitly set to null to ensure garbage collection
  }

  preload() {}
}
