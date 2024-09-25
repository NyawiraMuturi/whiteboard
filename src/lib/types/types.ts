export type ShapeType = 'rect' | 'circle' | 'line';

export type Shape = {
    id: string;
    type: ShapeType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    points?: number[];
    fill?: string;
    fillLinearGradientColorStops?: (string | number)[];
};

export type History = {
    shapes: Shape[];
};

export type BoardProps = {
    initialShapes?: Shape[];
};