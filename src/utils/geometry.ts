import { groupBy, partition } from "lodash";

// ChatGPT genearted code
export function getRectangleEdges(rect: Phaser.Geom.Rectangle): Phaser.Geom.Line[] {
    // Create lines for each edge of the rectangle
    const top = new Phaser.Geom.Line(rect.x, rect.y, rect.x + rect.width, rect.y);
    const right = new Phaser.Geom.Line(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height);
    const bottom = new Phaser.Geom.Line(rect.x + rect.width, rect.y + rect.height, rect.x, rect.y + rect.height);
    const left = new Phaser.Geom.Line(rect.x, rect.y + rect.height, rect.x, rect.y);

    return [top, right, bottom, left];
}

function mergeGroupedVerticalLines(groups: {[key: string]: Phaser.Geom.Line[]}): Phaser.Geom.Line[] {
    const mergedLines = [];

    for (const x in groups) {
        const lines = groups[x];

        // Sort lines by their y-coordinates
        lines.sort((a, b) => a.y1 - b.y1);

        let currentLine = lines[0];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (currentLine.y2 >= line.y1) {
                // Merge overlapping lines
                currentLine = new Phaser.Geom.Line(currentLine.x1, currentLine.y1, currentLine.x2, Math.max(currentLine.y2, line.y2));
            } else {
                // Push the current merged line and start a new one
                mergedLines.push(currentLine);
                currentLine = line;
            }
        }
        mergedLines.push(currentLine);
    }

    return mergedLines;
}

function mergeGroupedHorizontalLines(groups: {[key: string]: Phaser.Geom.Line[]}): Phaser.Geom.Line[] {
    const mergedLines = [];

    for (const y in groups) {
        const lines = groups[y];

        // Sort lines by their x-coordinates
        lines.sort((a, b) => a.x1 - b.x1);

        let currentLine = lines[0];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (currentLine.x2 >= line.x1) {
                // Merge overlapping lines
                currentLine = new Phaser.Geom.Line(currentLine.x1, currentLine.y1, Math.max(currentLine.x2, line.x2), currentLine.y2);
            } else {
                // Push the current merged line and start a new one
                mergedLines.push(currentLine);
                currentLine = line;
            }
        }
        mergedLines.push(currentLine);
    }

    return mergedLines;
}



export function mergeVerticalLines(lines: Phaser.Geom.Line[]): Phaser.Geom.Line[] {
    lines = lines.map(({x1, y1, y2}) => new Phaser.Geom.Line(
        x1,
        Math.min(y1, y2),
        x1,
        Math.max(y1, y2)
    ));

    const groups = groupBy(lines, (line) => line.x1);
    return mergeGroupedVerticalLines(groups);
}

export function mergeHorizontalLines(lines: Phaser.Geom.Line[]): Phaser.Geom.Line[] {
    lines = lines.map(({x1, x2, y1}) => new Phaser.Geom.Line(
        Math.min(x1, x2),
        y1,
        Math.max(x1, x2),
        y1
    ));

    const groups = groupBy(lines, (line) => line.y1);
    return mergeGroupedHorizontalLines(groups);
}

export function mergeLines(lines: Phaser.Geom.Line[]): Phaser.Geom.Line[] {
    const [verticalLines, horizonalLines] = partition(lines, (line) => line.x1 === line.x2);

    const mergedVerticalLines = mergeVerticalLines(verticalLines);
    const mergedHorizonalLines = mergeHorizontalLines(horizonalLines);

    return [...mergedVerticalLines, ...mergedHorizonalLines];
}