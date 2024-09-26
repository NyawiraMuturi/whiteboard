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
    const [isDrawing, setIsDrawing] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const lastPosRef = useRef<{ x: number, y: number } | null>(null);

    // Function to enable drawing mode
    const startDrawing = useCallback(() => {
        setIsErasing(false);  // Disable erasing
        setIsDrawing(true);   // Enable drawing
    }, []);

    // Function to enable erasing mode
    const startErasing = useCallback(() => {
        setIsDrawing(false);
        setIsErasing(true);
    }, []);

    // Function to handle mouse down (start drawing)
    const handleMouseDown = (stage: any) => {
        const pos = stage.getPointerPosition();
        if (!isDrawing && !isErasing) return;

        if (pos) {
            lastPosRef.current = { x: pos.x, y: pos.y }; // Store the initial position

            setLines((prevLines) => [
                ...prevLines,
                {
                    points: [pos.x, pos.y],
                    isErasing, // Track if we are erasing or drawing
                },
            ]);
        }
    };

    // Function to handle mouse movement (while drawing/erasing)
    const handleMouseMove = (stage: any) => {
        if (!isDrawing && !isErasing) return;

        const pos = stage.getPointerPosition();
        if (!pos || !lastPosRef.current) return;

        const lastPos = lastPosRef.current;

        // Update only if the mouse has moved significantly (to prevent rapid updates)
        if (Math.abs(pos.x - lastPos.x) > 1 || Math.abs(pos.y - lastPos.y) > 1) {
            lastPosRef.current = { x: pos.x, y: pos.y }; // Update the last position

            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
                setLines((prevLines) => {
                    if (prevLines.length === 0) return prevLines;

                    const lastLine = prevLines[prevLines.length - 1];
                    if (!lastLine || !lastLine.points) {
                        return prevLines;
                    }

                    const lastPointX = lastLine.points[lastLine.points.length - 2];
                    const lastPointY = lastLine.points[lastLine.points.length - 1];

                    // Only update if new points differ from the last
                    if (lastPointX !== pos.x || lastPointY !== pos.y) {
                        lastLine.points = lastLine.points.concat([pos.x, pos.y]);
                        return [...prevLines.slice(0, -1), lastLine];
                    }

                    return prevLines;
                });
            });
        }
    };

    // Function to handle mouse up (end drawing/erasing)
    const handleMouseUp = () => {
        setIsDrawing(false);
        setIsErasing(false);
        lastPosRef.current = null;
    };

    return {
        lines,
        startDrawing,
        startErasing,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
};
