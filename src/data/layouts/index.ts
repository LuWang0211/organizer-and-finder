// Import all layout files statically
import studioLayout from './studio.json';
import onebedroomLayout from './onebedroom.json';
import loftLayout from './loft.json';

import { LayoutData } from '@/app/new_house/layout-service';

// Type the imported JSON data
const layouts: Record<string, LayoutData> = {
  studio: studioLayout as LayoutData,
  onebedroom: onebedroomLayout as LayoutData,
  loft: loftLayout as LayoutData,
};

export default layouts;

// Export layout IDs for easy iteration
export const layoutIds = Object.keys(layouts);