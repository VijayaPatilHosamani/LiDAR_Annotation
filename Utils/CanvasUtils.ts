import { IPoint, ISize } from "../Types/Interfaces";

export class CanvasUtils {
    public static getMousePositionOnCanvasFromEvent(event: MouseEvent | any, canvas: HTMLCanvasElement): IPoint | null {
        if (!!canvas && !!event) {
            const canvasRect: ClientRect = canvas.getBoundingClientRect();
            return ({
                x: event.clientX - canvasRect.left,
                y: event.clientY - canvasRect.top
            });
        }
        return null;
    }

    public static getSize(canvas: HTMLCanvasElement): ISize | null {
        if (!!canvas) {
            const canvasRect: ClientRect | DOMRect = canvas.getBoundingClientRect();
            return {
                width: canvasRect.width,
                height: canvasRect.height
            }
        }
        return null;
    }

}