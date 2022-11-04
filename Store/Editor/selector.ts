import { store } from "../..";
import { ISize } from "../../Types/Interfaces";
import { UtilTypes } from "../../Types";


export class EditorSelector {

    public static getImageDragModeStatus(): boolean {
        return store.getState().Editor.imageDragMode;
    }
    public static getCrossHairVisibleStatus(): boolean {
        return store.getState().Editor.crossHairVisible;
    }
    public static getZoom(): number {
        return store.getState().Editor.zoom;
    }

    public static getSharpen(): number {
        return store.getState().Editor.sharpen;
    }
    public static getBlur(): number {
        return store.getState().Editor.blur;
    }
    public static getGrayscale(): number {
        return store.getState().Editor.grayscale;
    }

    public static getBrightness(): number { 
        return store.getState().Editor.brightness;
    }

    public static getContrast(): number { 
        return store.getState().Editor.contrast;
    }


    public static getPaintBrushThickness(): number { 
        return store.getState().Editor.paintBrushThickness;
    }

    public static getPaintBrushColor(): string { 
        return store.getState().Editor.paintBrushColor;
    }


    public static getMeasurement(): ISize {
        return store.getState().Editor.Measurement;
    }

    public static getActiveUtilType(): UtilTypes | null {
        return store.getState().Editor.activeUtilType;
    }

    public static getHideStatus(): boolean {
        return store.getState().Editor.Hide;
    }

    public static getDoState(): any { 
        return store.getState().Editor.DoState;
    }

    public static getUndoState(): any { 
        return store.getState().Editor.UndoState;
    }

    // public static getRedoState(): any { 
    //     return store.getState().Editor.RedoState;
    // }
}