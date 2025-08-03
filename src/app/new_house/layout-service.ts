import layouts, { layoutIds } from '@/data/layouts';

export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  roomCount: number;
  features: string[];
  floorplanPicture: string;
}

export interface HouseMetadata {
  type: string;
  width: number;
  height: number;
  floorplanPicture: string;
}

export interface RoomMetadata {
  h: number;
  w: number;
  x: number;
  y: number;
}

export interface UIMetadata {
  name: string;
  description: string;
  features: string[];
}

export interface LayoutData {
  house: HouseMetadata;
  ui: UIMetadata;
  rooms: Array<{
    id: string;
    name: string;
    metadata: RoomMetadata;
  }>;
}

export function getLayoutOptions(): LayoutOption[] {
  const options: LayoutOption[] = [];
  
  for (const layoutId of layoutIds) {
    try {
      const layoutData = layouts[layoutId];
      
      // Extract UI metadata from imported JSON data
      options.push({
        id: layoutId,
        name: layoutData.ui.name,
        description: layoutData.ui.description,
        roomCount: layoutData.rooms.length,
        features: layoutData.ui.features,
        floorplanPicture: layoutData.house.floorplanPicture
      });
    } catch (error) {
      console.warn(`Failed to process layout ${layoutId}:`, error);
    }
  }
  
  return options.sort((a, b) => a.name.localeCompare(b.name));
}

export function getLayoutData(layoutId: string): LayoutData {
  const layoutData = layouts[layoutId];
  if (!layoutData) {
    throw new Error(`Layout ${layoutId} not found`);
  }
  return layoutData;
}