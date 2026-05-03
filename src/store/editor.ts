import { create } from 'zustand';

export type SelectedElement = {
  type: 'button' | 'image' | 'text';
  settingsKey: string;
  slug: string;
  data: any; // { label, link } for button, { src } for image, etc.
} | null;

interface EditorStore {
  isEditMode: boolean;
  selectedElement: SelectedElement;
  toggleEditMode: () => void;
  setEditMode: (mode: boolean) => void;
  setSelectedElement: (element: SelectedElement) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  isEditMode: false,
  selectedElement: null,
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  setEditMode: (mode) => set({ isEditMode: mode, selectedElement: null }),
  setSelectedElement: (element) => set({ selectedElement: element }),
}));
