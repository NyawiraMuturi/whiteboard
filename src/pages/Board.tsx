import { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Line, Image, Star, Arrow } from 'react-konva';
import { Shape, History } from '@/lib/types/types';
import { useUploadImage, useDrawing } from '@/hooks';
import { Redo2, Undo2, Palette, Minus, RectangleHorizontal, Star as StarIcon, PenLine, CircleIcon, Eraser, Image as ImageIcon, Share2, Download, ArrowLeftIcon } from "lucide-react"
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
    const stageRef = useRef(null)
    const {
        lines,
        arrows,
        rectangles,
        circles,
        stars,
        startDrawing,
        startArrowDrawing,
        startCircleDrawing,
        startRectangleDrawing,
        startStarDrawing,
        startErasing,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    } = useDrawing();


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

    const downloadURI = (uri: string | undefined, name: string) => {
        const link = document.createElement("a");
        link.download = name;
        link.href = uri || "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const onExportClick = useCallback(() => {
        const dataUri = stageRef?.current?.toDataURL({ pixelRatio: 3 });
        downloadURI(dataUri, "image.png");
    }, []);




    return (
        <div className="relative">
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={(e) => handleMouseDown(e.target.getStage())}
                onMouseMove={(e) => handleMouseMove(e.target.getStage())}
                onMouseUp={handleMouseUp}
                ref={stageRef}
            >
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        fill="white"
                        id="bg"
                    />

                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.isErasing ? '#ffffff' : '#000000'}
                            strokeWidth={5}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={
                                line.isErasing ? 'destination-out' : 'source-over'
                            }
                        />
                    ))}

                    {arrows.map((arrow, i) => (
                        <Arrow
                            key={i}
                            points={arrow.points}
                            pointerLength={10}
                            pointerWidth={10}
                            fill="#000"
                            stroke="#000"
                            strokeWidth={4}
                        />
                    ))}

                    {circles.map((circle, i) => (
                        <Circle
                            key={i}
                            x={circle.x}
                            y={circle.y}
                            radius={circle.radius}
                            fill="#000"
                        />
                    ))}

                    {stars.map((star, i) => (
                        <Star
                            key={i}
                            x={star.x}
                            y={star.y}
                            numPoints={star.numPoints}
                            innerRadius={star.innerRadius}
                            outerRadius={star.outerRadius}
                            fill="#000"
                        />
                    ))}

                    {rectangles.map((rect, i) => (
                        <Rect
                            key={i}
                            x={rect.x}
                            y={rect.y}
                            width={rect.width}
                            height={rect.height}
                            fill="#000"
                        />
                    ))}

                    {shapes.map((shape) => {

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
                            <HexColorPicker color={color} onChange={(newColor) => { setColor(newColor); changeColor(newColor); }} />
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Minus /></MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem> <ArrowLeftIcon onClick={startArrowDrawing} /></MenubarItem>
                            <MenubarItem>  <CircleIcon onClick={startCircleDrawing} /> </MenubarItem>
                            <MenubarItem> <RectangleHorizontal onClick={startRectangleDrawing} /> </MenubarItem>
                            <MenubarItem> <StarIcon onClick={startStarDrawing} /> </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger onClick={startDrawing}><PenLine /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger onClick={startErasing}><Eraser /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger onClick={uploadImage}><ImageIcon /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Share2 /></MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger><Download onClick={onExportClick} /></MenubarTrigger>
                    </MenubarMenu>

                </Menubar>

            </div>
        </div>
    );
};

export default Board;
