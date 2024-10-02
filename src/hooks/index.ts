import { useState, useCallback, useRef } from 'react';



//export images

export const useUploadImage = () => {
    const [imageData, setImageData] = useState({
        image: null,
        x: 50,
        y: 50,
        width: 0,
        height: 0,
        draggable: true
    });

    const uploadImage = useCallback(() => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new window.Image();
                    img.src = event.target!.result as string;
                    img.onload = () => {
                        setImageData({
                            image: img,
                            x: 50,
                            y: 50,
                            width: img.width,
                            height: img.height,
                            draggable: true
                        });
                    };
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    }, []);

    return { uploadImage, imageData };
};


export const useDrawing = () => {
    const [lines, setLines] = useState<any[]>([]);
    const [arrows, setArrows] = useState<any[]>([]);
    const [rectangles, setRectangles] = useState<any[]>([]);
    const [circles, setCircles] = useState<any[]>([]);
    const [stars, setStars] = useState<any[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [isDrawingArrow, setIsDrawingArrow] = useState(false);
    const [isDrawingCircle, setIsDrawingCircle] = useState(false);
    const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
    const [isDrawingStar, setIsDrawingStar] = useState(false);
    const lastPosRef = useRef<{ x: number, y: number } | null>(null);

    const startDrawing = useCallback(() => {
        setIsErasing(false);
        setIsDrawing(true);
        setIsDrawingArrow(false);
        setIsDrawingCircle(false);
        setIsDrawingRectangle(false);
        setIsDrawingStar(false);
    }, []);

    const startErasing = useCallback(() => {
        setIsDrawing(false);
        setIsErasing(true);
        setIsDrawingArrow(false);
        setIsDrawingCircle(false);
        setIsDrawingRectangle(false);
        setIsDrawingStar(false);
    }, []);

    const startArrowDrawing = useCallback(() => {
        setIsDrawing(false);
        setIsErasing(false);
        setIsDrawingArrow(true);
        setIsDrawingCircle(false);
        setIsDrawingRectangle(false);
        setIsDrawingStar(false);
    }, []);

    const startCircleDrawing = useCallback(() => {
        setIsDrawing(false);
        setIsErasing(false);
        setIsDrawingArrow(false);
        setIsDrawingCircle(true);
        setIsDrawingRectangle(false);
        setIsDrawingStar(false);
    }, []);

    const startRectangleDrawing = useCallback(() => {
        setIsDrawing(false);
        setIsErasing(false);
        setIsDrawingArrow(false);
        setIsDrawingCircle(false);
        setIsDrawingRectangle(true);
        setIsDrawingStar(false);
    }, []);

    const startStarDrawing = useCallback(() => {
        setIsDrawing(false);
        setIsErasing(false);
        setIsDrawingArrow(false);
        setIsDrawingCircle(false);
        setIsDrawingRectangle(false);
        setIsDrawingStar(true);
    }, []);

    const handleMouseDown = (stage: any) => {
        const pos = stage.getPointerPosition();
        if (!isDrawing && !isErasing && !isDrawingArrow && !isDrawingCircle && !isDrawingRectangle && !isDrawingStar) return;

        if (pos) {
            lastPosRef.current = { x: pos.x, y: pos.y };

            if (isDrawingArrow) {
                setArrows((prevArrows) => [
                    ...prevArrows,
                    { points: [pos.x, pos.y] },
                ]);
            } else if (isDrawingCircle) {
                setCircles((prevCircles) => [
                    ...prevCircles,
                    { x: pos.x, y: pos.y, radius: 0 },
                ]);
            } else if (isDrawingRectangle) {
                setRectangles((prevRectangles) => [
                    ...prevRectangles,
                    { x: pos.x, y: pos.y, width: 0, height: 0 },
                ]);
            } else if (isDrawingStar) {
                setStars((prevStars) => [
                    ...prevStars,
                    { x: pos.x, y: pos.y, numPoints: 5, innerRadius: 0, outerRadius: 0 },
                ]);
            }
        }
    };

    const handleMouseMove = (stage: any) => {
        const pos = stage.getPointerPosition();
        if (!pos || !lastPosRef.current) return;

        const { x, y } = lastPosRef.current;

        if (isDrawingArrow) {
            setArrows((prevArrows) => {
                if (prevArrows.length === 0) return prevArrows;

                const lastArrow = prevArrows[prevArrows.length - 1];
                lastArrow.points = [x, y, pos.x, pos.y];
                return [...prevArrows.slice(0, -1), lastArrow];
            });
        } else if (isDrawingCircle) {
            setCircles((prevCircles) => {
                const lastCircle = prevCircles[prevCircles.length - 1];
                const radius = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                lastCircle.radius = radius;
                return [...prevCircles.slice(0, -1), lastCircle];
            });
        } else if (isDrawingRectangle) {
            setRectangles((prevRectangles) => {
                const lastRectangle = prevRectangles[prevRectangles.length - 1];
                lastRectangle.width = pos.x - x;
                lastRectangle.height = pos.y - y;
                return [...prevRectangles.slice(0, -1), lastRectangle];
            });
        } else if (isDrawingStar) {
            setStars((prevStars) => {
                const lastStar = prevStars[prevStars.length - 1];
                const outerRadius = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                lastStar.outerRadius = outerRadius;
                lastStar.innerRadius = outerRadius / 2; // Inner radius is typically smaller
                return [...prevStars.slice(0, -1), lastStar];
            });
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setIsErasing(false);
        setIsDrawingArrow(false);
        setIsDrawingCircle(false);
        setIsDrawingRectangle(false);
        setIsDrawingStar(false);
        lastPosRef.current = null;
    };

    return {
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
    };
};

