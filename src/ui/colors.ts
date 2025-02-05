export const FloorPlanColors = [
    "red-500",
    "yellow-500",
    "green-700",
    "blue-700",
    "purple-800",
];

export function getColorByNumber(index: number): string {
    return FloorPlanColors[index % FloorPlanColors.length];
}