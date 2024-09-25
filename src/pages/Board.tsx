import { useState } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import { Shape, History, BoardProps } from '@/lib/types/types';
import { Button } from '@/components/ui/button';
import { Redo2, Undo2, Palette, Minus } from "lucide-react"
import { HexColorPicker } from "react-colorful";


const Board = ({ initialShapes = [
    { id: 'rect1', type: 'rect', x: 50, y: 100, width: 100, height: 100, fill: 'red' },
    { id: 'circle1', type: 'circle', x: 200, y: 150, radius: 50, fill: 'green' },
    { id: 'line1', type: 'line', x: 20, y: 200, points: [0, 0, 100, 0, 100, 100], fillLinearGradientColorStops: [0, 'red', 1, 'yellow'] },
] }: BoardProps) => {

    const [history, setHistory] = useState<History[]>([]);
    const [future, setFuture] = useState<History[]>([]);
    const [shapes, setShapes] = useState<Shape[]>(initialShapes);
    const [color, setColor] = useState("#b32aa9");


    const handleDragEnd = (id: string, e: any) => {
        const newShapes = shapes.map((shape) => {
            if (shape.id === id) {
                return {
                    ...shape,
                    x: e.target.x(),
                    y: e.target.y(),
                };
            }
            return shape;
        });
        setHistory([...history, { shapes }]);
        setShapes(newShapes);
        setFuture([]);
    };


    const handleUndo = () => {
        if (history.length === 0) return;
        const prevState = history[history.length - 1];
        setFuture([{ shapes }, ...future]);
        setShapes(prevState.shapes);
        setHistory(history.slice(0, -1));
    };

    const handleRedo = () => {
        if (future.length === 0) return;
        const nextState = future[0];
        setHistory([...history, { shapes }]);
        setShapes(nextState.shapes);
        setFuture(future.slice(1));
    };

    return (
        <div className="relative">
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>

                    {shapes.map((shape) => {
                        if (shape.type === 'rect') {
                            return (
                                <Rect
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    width={shape.width}
                                    height={shape.height}
                                    fill={shape.fill}
                                    shadowBlur={10}
                                    draggable
                                    onDragEnd={(e) => handleDragEnd(shape.id, e)}
                                />
                            );
                        }
                        if (shape.type === 'circle') {
                            return (
                                <Circle
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    radius={shape.radius}
                                    fill={shape.fill}
                                    draggable
                                    onDragEnd={(e) => handleDragEnd(shape.id, e)}
                                />
                            );
                        }
                        if (shape.type === 'line') {
                            return (
                                <Line
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    points={shape.points}
                                    tension={0.5}
                                    closed
                                    stroke="black"
                                    fillLinearGradientStartPoint={{ x: -50, y: -50 }}
                                    fillLinearGradientEndPoint={{ x: 50, y: 50 }}
                                    fillLinearGradientColorStops={shape.fillLinearGradientColorStops}
                                    draggable
                                    onDragEnd={(e) => handleDragEnd(shape.id, e)}
                                />
                            );
                        }
                        return null;
                    })}
                </Layer>
            </Stage>


            <div className="absolute top-[30%] left-[-15%] flex flex-col space-x-2 bg-primary  rounded-md">
                <div>
                    <Button

                    >
                        <Undo2 onClick={handleUndo} />
                    </Button>
                    <Button
                        onClick={handleRedo}
                    >
                        <Redo2 />
                    </Button>
                </div>

                <div>

                    <Button
                    >
                        <Minus />
                    </Button>

                    <Button
                    >
                        <Palette />
                    </Button>

                </div>

            </div>
        </div>
    );
};

export default Board;
