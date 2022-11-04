import { IPoint } from "./IPoint";
import { IRect } from "./IRect";
import { ISize } from "./ISize";

export interface IEditor {
    defaultImageRect: IRect | null,
    canvasContentImageRect: IRect | null
    canvasSize: ISize | null,
    realImageSize: ISize | null,
    canvasContentSize: ISize | null,
    zoom: number,
    event?: any,//Event | KeyboardEvent,
    mousePositionOnCanvasContent: IPoint,
}