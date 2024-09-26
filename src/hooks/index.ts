import { useState, useCallback } from 'react';

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
