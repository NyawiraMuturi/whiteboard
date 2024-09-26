import { useState, useEffect } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Circle, Line, Image } from 'react-konva';
import { Shape, History } from '@/lib/types/types';
import { useUploadImage } from '@/hooks';
import { Redo2, Undo2, Palette, Minus, RectangleHorizontal, Star, PenLine, CircleIcon, Eraser, Image as ImageIcon, Share2, Download } from "lucide-react"
import { HexColorPicker } from "react-colorful";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"


const Board = () => {
    const [history, setHistory] = useState<History[]>([]);
    const [future, setFuture] = useState<History[]>([]);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const { uploadImage, imageData } = useUploadImage();
    const [color, setColor] = useState("#b32aa9");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [drawingMode, setDrawingMode] = useState<Shape['type'] | null>(null);


    useEffect(() => {
        if (imageData.image) {
            const newImageShape = {
                id: `image${shapes.length + 1}`,
                type: 'image',
                image: imageData.image,
                x: imageData.x,
                y: imageData.y,
                width: imageData.width,
                height: imageData.height,
                draggable: imageData.draggable,
            };
            setShapes((shapes) => [...shapes, newImageShape]);
        }
    }, [imageData]);

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

    const handleCanvasClick = (e: any) => {
        if (!drawingMode) return;

        const pos = e.target.getStage().getPointerPosition();
        let newShape: Shape;

        if (drawingMode === 'rect') {
            newShape = {
                id: `rect${shapes.length + 1}`,
                type: 'rect',
                x: pos.x,
                y: pos.y,
                width: 100,
                height: 100,
                fill: color,
            };
        } else if (drawingMode === 'circle') {
            newShape = {
                id: `circle${shapes.length + 1}`,
                type: 'circle',
                x: pos.x,
                y: pos.y,
                radius: 50,
                fill: color,
            };
        } else if (drawingMode === 'line') {
            newShape = {
                id: `line${shapes.length + 1}`,
                type: 'line',
                x: pos.x,
                y: pos.y,
                points: [0, 0, 100, 0, 100, 100],
                fillLinearGradientColorStops: [0, color, 1, 'yellow'],
            };
        } else {
            return;
        }

        setShapes([...shapes, newShape]);
        setDrawingMode(null);
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

                        if (shape.type === 'image') {
                            return (
                                <Image
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    image={shape.image}
                                    width={shape.width}
                                    height={shape.height}
                                    draggable
                                    onDragEnd={(e) => handleDragEnd(shape.id, e)}
                                />
                            );
                        }
                        return null;
                    })}
                </Layer>
            </Stage>


            <div className="absolute top-[25%] left-[-15%] ">
                <Menubar className='bg-primary text-white'>
                    <MenubarMenu>
                        <MenubarTrigger><Undo2 onClick={handleUndo} /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Redo2 onClick={handleRedo} /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Palette onClick={() => setShowColorPicker(!showColorPicker)} /></MenubarTrigger>
                        <MenubarContent>
                            <HexColorPicker color={color} onChange={setColor} />
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Minus /></MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>  <CircleIcon /> </MenubarItem>
                            <MenubarItem> <RectangleHorizontal /> </MenubarItem>
                            <MenubarItem> <Star /> </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><PenLine /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Eraser /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger onClick={uploadImage}><ImageIcon /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Share2 /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Download /></MenubarTrigger>
                    </MenubarMenu>

                </Menubar>

            </div>
        </div>
    );
};

export default Board;
