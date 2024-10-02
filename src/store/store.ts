import { create } from "zustand";

type Store = {
    shapeColor: string;
    backgroundColor: string;
    setShapeColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
};

export const useStore = create<Store>((set) => ({
    shapeColor: '#000000',
    backgroundColor: '#ffffff',
    setShapeColor: (color: string) => set({ shapeColor: color }),
    setBackgroundColor: (color: string) => set({ backgroundColor: color }),
}));


