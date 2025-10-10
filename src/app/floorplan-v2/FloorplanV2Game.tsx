"use client";

import { ChevronDown, Download, Magnet, Upload } from "lucide-react";
import { Game } from "phaser";
import AnchorPlugin from "phaser3-rex-plugins/plugins/anchor-plugin";
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLatest, useMeasure } from "react-use";
import { FloorPlanColors, getHexColorByName } from "@/ui/colors";
import { Button } from "@/ui/components/Button";
import { Icon } from "@/ui/components/Icon";
import { FloorplanV2Scene } from "./FloorplanV2Scene";
import { UIScene } from "./UIScene";

export default function FloorplanV2Game() {
  const floorplanV2Game = useRef<Game>(undefined);
  const floorplanV2Container = useRef<HTMLDivElement>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedRectangle, setSelectedRectangle] = useState<any>(null);
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null);
  const [snappingEnabled, setSnappingEnabled] = useState(true);
  const [rectangleCount, setRectangleCount] = useState(0);
  const [polygonCount, setPolygonCount] = useState(0);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  const [containerMeasure, { width: containerWidth, height: containerHeight }] =
    useMeasure<HTMLDivElement>();

  const assignRef = useCallback(
    (element: HTMLDivElement) => {
      containerMeasure(element);
      floorplanV2Container.current = element;
    },
    [containerMeasure],
  );

  const floorplanV2Config = useRef({
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    transparent: true,
    scene: [FloorplanV2Scene, UIScene],
    scale: {
      mode: Phaser.Scale.NONE,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    plugins: {
      scene: [
        {
          key: "rexUI",
          plugin: UIPlugin,
          mapping: "rexUI",
        },
        {
          key: "rexGestures",
          plugin: GesturesPlugin,
          mapping: "rexGestures",
        },
      ],
      global: [
        {
          key: "rexAnchor",
          plugin: AnchorPlugin,
          start: true,
        },
      ],
    },
  }).current;

  const handleResetScale = useCallback(() => {
    if (floorplanV2Game.current) {
      const scene = floorplanV2Game.current.scene.getScene(
        "FloorplanV2Scene",
      ) as FloorplanV2Scene;
      if (scene) {
        scene.events.emit("resetScale");
      }
    }
  }, []);

  const handleToggleDrawingMode = useCallback(() => {
    const newDrawingMode = !isDrawingMode;
    setIsDrawingMode(newDrawingMode);

    if (floorplanV2Game.current) {
      const scene = floorplanV2Game.current.scene.getScene(
        "FloorplanV2Scene",
      ) as FloorplanV2Scene;
      if (scene) {
        scene.events.emit("toggleDrawingMode", newDrawingMode);
      }
    }
  }, [isDrawingMode]);

  const handleDeleteRectangle = useCallback(() => {
    if (floorplanV2Game.current && selectedRectangle) {
      const scene = floorplanV2Game.current.scene.getScene(
        "FloorplanV2Scene",
      ) as FloorplanV2Scene;
      if (scene) {
        scene.events.emit("deleteSelectedRectangle");
      }
    }
  }, [selectedRectangle]);

  const handleToggleSnapping = useCallback(() => {
    const newSnappingState = !snappingEnabled;
    setSnappingEnabled(newSnappingState);

    if (floorplanV2Game.current) {
      const scene = floorplanV2Game.current.scene.getScene(
        "FloorplanV2Scene",
      ) as FloorplanV2Scene;
      if (scene) {
        scene.events.emit("toggleSnapping", newSnappingState);
      }
    }
  }, [snappingEnabled]);

  const handleCombineRectangles = useCallback(() => {
    if (floorplanV2Game.current) {
      const scene = floorplanV2Game.current.scene.getScene(
        "FloorplanV2Scene",
      ) as FloorplanV2Scene;
      if (scene) {
        scene.events.emit("combineRectangles");
      }
    }
  }, []);

  const handleDeletePolygon = useCallback(() => {
    if (floorplanV2Game.current && selectedPolygon) {
      const scene = floorplanV2Game.current.scene.getScene(
        "FloorplanV2Scene",
      ) as FloorplanV2Scene;
      if (scene) {
        scene.events.emit("deleteSelectedPolygon");
      }
    }
  }, [selectedPolygon]);

  const handleColorChange = useCallback(
    (color: string) => {
      if (floorplanV2Game.current && selectedPolygon) {
        const scene = floorplanV2Game.current.scene.getScene(
          "FloorplanV2Scene",
        ) as FloorplanV2Scene;
        if (scene) {
          scene.events.emit("changePolygonColor", color);
        }
      }
      setShowColorDropdown(false);
    },
    [selectedPolygon],
  );

  const handleSetLabel = useCallback(() => {
    console.log("handleSetLabel", selectedPolygon);
    if (floorplanV2Game.current && selectedPolygon) {
      const currentLabel = selectedPolygon.label || "";
      const newLabel = prompt("Enter label for this room area:", currentLabel);
      if (newLabel !== null) {
        // null means cancelled, empty string is valid
        const scene = floorplanV2Game.current.scene.getScene(
          "FloorplanV2Scene",
        ) as FloorplanV2Scene;
        if (scene) {
          scene.events.emit("setPolygonLabel", newLabel);
        }
      }
    }
  }, [selectedPolygon]);

  const handleReloadBackground = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string;
          if (floorplanV2Game.current) {
            const scene = floorplanV2Game.current.scene.getScene(
              "FloorplanV2Scene",
            ) as FloorplanV2Scene;
            if (scene) {
              scene.events.emit(
                "reloadBackgroundImage",
                imageDataUrl,
                file.name,
              );
            }
          }
        };
        reader.readAsDataURL(file);
      }
      // Reset the input value so the same file can be selected again
      if (event.target) {
        event.target.value = "";
      }
    },
    [],
  );

  const handleExportPolygons = useCallback(() => {
    if (floorplanV2Game.current) {
      const scene = floorplanV2Game.current.scene.getScene(
        "FloorplanV2Scene",
      ) as FloorplanV2Scene;
      if (scene) {
        const polygons = scene.getStagingPolygons();
        const backgroundInfo = scene.getBackgroundInfo();

        const fileContent = JSON.stringify(
          {
            house: {
              type: backgroundInfo.type,
              width: backgroundInfo.width,
              height: backgroundInfo.height,
              floorplanPicture: backgroundInfo.floorplanPicture,
            },
            ui: {
              name: "TBD",
              description: "TBD",
              features: ["TBD"],
            },
            rooms: polygons.map((polygon) => {
              // Convert label to dash-separated identifier for id
              const id = polygon.label
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              return {
                id: id || "untitled",
                name: polygon.label,
                metadata: {
                  vertices: polygon.getVertices(),
                  color: polygon.color,
                },
              };
            }),
            exportedAt: new Date().toISOString(),
          },
          null,
          2,
        );

        const blob = new Blob([fileContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        let a: HTMLAnchorElement | null = document.createElement("a");
        a.href = url;
        a.download = "floorplan-polygons.json";
        a.click();

        URL.revokeObjectURL(url);
        a.remove();
        a = null;
      }
    }
  }, []);

  // Keep a ref to the latest handleSetLabel function to avoid closure issues
  const handleSetLabelRef = useLatest(handleSetLabel);

  useLayoutEffect(() => {
    if (floorplanV2Game.current === undefined) {
      console.log("Creating floorplan v2 game");

      floorplanV2Game.current = new Game({
        ...floorplanV2Config,
        parent: floorplanV2Container.current,
        input: {
          mouse: {
            target: floorplanV2Container.current,
          },
          touch: {
            target: floorplanV2Container.current,
          },
        },
      });

      floorplanV2Game.current.events.on(
        "sceneReady",
        (scene: FloorplanV2Scene) => {
          scene.events.on("rectangleSelected", (rectangle: any) => {
            setSelectedRectangle(rectangle);
            // Clear polygon selection when rectangle is selected
            if (rectangle) {
              setSelectedPolygon(null);
            }
          });

          scene.events.on("polygonSelected", (polygon: any) => {
            setSelectedPolygon(polygon);
            // Clear rectangle selection when polygon is selected
            if (polygon) {
              setSelectedRectangle(null);
            }
          });

          scene.events.on("rectangleCountChanged", (count: number) => {
            setRectangleCount(count);
          });

          scene.events.on("polygonCountChanged", (count: number) => {
            setPolygonCount(count);
          });

          scene.events.on("polygonThumbnailDoubleClicked", (polygon: any) => {
            // Ensure the double-clicked polygon is selected, then use unified handleSetLabel
            setSelectedPolygon(polygon);
            // Use setTimeout with useLatest ref to get the latest handleSetLabel function
            setTimeout(() => handleSetLabelRef.current(), 0);
          });

          // Sync initial snapping state (use true as default since snappingEnabled starts as true)
          scene.events.emit("toggleSnapping", true);
        },
      );
    }

    return () => {
      if (floorplanV2Game.current) {
        floorplanV2Game.current.destroy(true);
        floorplanV2Game.current = undefined;
      }
    };
  }, [handleSetLabelRef.current, floorplanV2Config, handleSetLabelRef]);

  useEffect(() => {
    if (containerWidth > 0 && containerHeight > 0) {
      const containerAspectRatio = containerWidth / containerHeight;
      const fitWidth = 768 * containerAspectRatio;

      floorplanV2Game.current?.scale.resize(fitWidth, 768);
      floorplanV2Game.current?.scale.setZoom(containerHeight / 768);
    }
  }, [containerWidth, containerHeight]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showColorDropdown) {
        setShowColorDropdown(false);
      }
    };

    if (showColorDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showColorDropdown]);

  return (
    <div className="w-full h-full relative">
      <div ref={assignRef} className="w-full h-full overflow-hidden" />

      {/* Top Controls Layout: Left, Center, Right */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4">
        {/* Left Section */}
        <div className="absolute left-4 top-0 flex gap-2">
          {/* Reload Background Button - only show when no selection */}
          {!selectedPolygon && !selectedRectangle && (
            <Button
              onClick={handleReloadBackground}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Reload Background
            </Button>
          )}
          {/* Export Button - only show when no polygon selected and at least 1 polygon exists */}
          {!selectedPolygon && polygonCount > 0 && (
            <Button
              onClick={handleExportPolygons}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Export Polygons
            </Button>
          )}
          {selectedPolygon && (
            <>
              <div className="relative">
                <Button
                  onClick={() => setShowColorDropdown(!showColorDropdown)}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-12 h-7 rounded border border-gray-300"
                    style={{
                      backgroundColor: getHexColorByName(
                        selectedPolygon.color || "gray-500",
                      ),
                    }}
                    title={selectedPolygon.color || "gray-500"}
                  />
                  <ChevronDown size={12} />
                </Button>
                {showColorDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50">
                    <div className="p-2 flex flex-col gap-1">
                      {FloorPlanColors.map((color) => (
                        <button
                          type="button"
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                            selectedPolygon.color === color
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: getHexColorByName(color) }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button onClick={handleSetLabel} variant="secondary" size="sm">
                Set Label
              </Button>
              <Button
                onClick={handleDeletePolygon}
                variant="secondary"
                size="sm"
              >
                Delete Polygon
              </Button>
            </>
          )}
        </div>

        {/* Center Section - Snapping Toggle (Absolutely Centered) */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 flex gap-2">
          <div className="relative group">
            <Icon
              onClick={handleToggleSnapping}
              variant={snappingEnabled ? "primary" : "default"}
              size="sm"
              className="cursor-pointer"
              iconKey="magnet"
            />
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 delay-0 group-hover:delay-500 pointer-events-none z-50">
              {snappingEnabled
                ? "Snapping: ON - Click to disable"
                : "Snapping: OFF - Click to enable"}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="absolute right-4 top-0 flex gap-2">
          {rectangleCount > 0 && !isDrawingMode && (
            <Button
              onClick={handleCombineRectangles}
              variant="primary"
              size="sm"
            >
              Combine ({rectangleCount})
            </Button>
          )}
          {selectedRectangle && (
            <Button
              onClick={handleDeleteRectangle}
              variant="secondary"
              size="sm"
            >
              Delete Rectangle
            </Button>
          )}
          <Button
            onClick={handleToggleDrawingMode}
            variant={isDrawingMode ? "secondary" : "primary"}
            size="sm"
          >
            {isDrawingMode ? "Exit Drawing" : "New Rectangle"}
          </Button>
          <Button onClick={handleResetScale} variant="outline" size="sm">
            Reset Scale
          </Button>
        </div>
      </div>

      {/* Hidden file input for background reload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
}
