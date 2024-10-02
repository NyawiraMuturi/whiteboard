import { create } from "zustand";

type Store = {
    shapeColor: string;
    backgroundImage: string | null;
    setShapeColor: (color: string) => void;
    setBackgroundImage: (image: string | null) => void;
};

export const useStore = create<Store>((set) => ({
    shapeColor: '#000000',
    backgroundImage: null,
    setShapeColor: (color: string) => set({ shapeColor: color }),
    setBackgroundImage: (image: string | null) => set({ backgroundImage: image }),
}));


