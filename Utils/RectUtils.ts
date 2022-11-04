import { store } from '..'
import { IRect, IPoint, ISize, IEditor } from "../Types/Interfaces";
import { LabelsSelector, LabelRect, ImageDataType } from "../Store/Label";
import { RenderUtils } from "./RenderUtils";
import { RectConfigs } from "../Configs/RectConfigs";
import { DrawUtils } from ".";
import { EditorSelector } from "../Store/Editor";


export class RectUtils {

    public static translate(rect: IRect, delta: IPoint): IRect {
        return {
            ...rect,
            x: rect.x + delta.x,
            y: rect.y + delta.y
        }
    }

    public static expand(rect: IRect, delta: IPoint): IRect {
        return {
            x: rect.x - delta.x,
            y: rect.y - delta.y,
            width: rect.width + 2 * delta.x,
            height: rect.height + 2 * delta.y
        }
    }

    public static scale(rect: IRect, scale: number): IRect {
        return {
            x: rect.x * scale,
            y: rect.y * scale,
            width: rect.width * scale,
            height: rect.height * scale
        }
    }
    public static intersect(rect1: IRect, rect2: IRect): boolean | null {
        if (!rect1 || !rect2) {
            return null;
        }
        return !(
            rect2.x > rect1.x + rect1.width ||
            rect2.x + rect2.width < rect1.x ||
            rect2.y > rect1.y + rect1.height ||
            rect2.y + rect2.height < rect1.y
        );
    }

    public static isPointInside(rect: IRect, point: IPoint): boolean | null {
        if (!rect || !point) {
            return null;
        }
        return (
            rect.x < point.x &&
            rect.x + rect.width > point.x &&
            rect.y < point.y &&
            rect.y + rect.height > point.y
        )
    }

    public static getRatio(rect: IRect): number | null {
        if (!rect) {
            return null;
        }


        return rect.width / rect.height
    }

    public static getRectWithCenterAndSize(centerPoint: IPoint, size: ISize): IRect {
        return {
            x: centerPoint.x - 0.5 * size.width,
            y: centerPoint.y - 0.5 * size.height,
            ...size
        }
    }

    public static keepPointWithinRect(point: IPoint): IPoint {
        return point;
        // if (RectUtils.isPointInside(rect, point))
        //     return point;

        // return {
        //     x: NumberUtils.keepValueWithinRange(point.x, rect.x, rect.x + rect.width),
        //     y: NumberUtils.keepValueWithinRange(point.y, rect.y, rect.y + rect.height)
        // }
    }

    public static fitInsideRectWithRatio(containerRect: IRect, ratio: number): IRect {
        const containerRectRatio = RectUtils.getRatio(containerRect);
        if (containerRectRatio && containerRectRatio < ratio) {
            const innerRectHeight = containerRect.width / ratio;
            return {
                x: containerRect.x,
                y: containerRect.y + (containerRect.height - innerRectHeight) / 2,
                width: containerRect.width,
                height: innerRectHeight
            }
        }
        else {
            const innerRectWidth = containerRect.height * ratio;
            return {
                x: containerRect.x + (containerRect.width - innerRectWidth) / 2,
                y: containerRect.y,
                width: innerRectWidth,
                height: containerRect.height
            }
        }
    }

    public static drawExistingRectangles(canvas: HTMLCanvasElement, data: IEditor) {
        const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
        if (imageData) {
            imageData.labelRects.forEach((labelRect: LabelRect) => {
                //if (!labelRect.isHidden) {
                let kt = store.getState().labels.inEditLabelId;
                if (!labelRect.isHidden && !(store.getState().labels.isEditMode === true && kt === labelRect.id)) {
                    if (data.canvasContentImageRect) {
                        if (EditorSelector.getZoom() !== 1) {
                            let pt: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent({ x: labelRect.Rect.x, y: labelRect.Rect.y }, data);
                            let endPoint: IPoint | null = {
                                x: labelRect.Rect.x + labelRect.Rect.width,
                                y: labelRect.Rect.y + labelRect.Rect.height
                            }
                            let cht: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent({ x: endPoint.x, y: endPoint.y }, data);

                            if (pt && cht) {
                                DrawUtils.drawRect(canvas, {
                                    x: pt.x,
                                    y: pt.y,
                                    width: Math.abs(cht.x - pt.x),
                                    height: Math.abs(cht.y - pt.y),
                                }, labelRect.Rect, RectConfigs.RECT_INACTIVE_COLOR, RectConfigs.RECT_THICKNESS);
                            }
                            return;
                        }

                        DrawUtils.drawRect(canvas, labelRect.Rect, labelRect.Rect, RectConfigs.RECT_INACTIVE_COLOR, RectConfigs.RECT_THICKNESS);
                    }
                }


                if ((store.getState().labels.isEditMode === true && kt === labelRect.id)) {
                    if (data.canvasContentImageRect) {
                        if (EditorSelector.getZoom() !== 1) {
                            let pt: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent({ x: labelRect.Rect.x, y: labelRect.Rect.y }, data);
                            let endPoint: IPoint | null = {
                                x: labelRect.Rect.x + labelRect.Rect.width,
                                y: labelRect.Rect.y + labelRect.Rect.height
                            }
                            let cht: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent({ x: endPoint.x, y: endPoint.y }, data);
                            if (pt && cht) {
                                DrawUtils.drawRect(canvas, {
                                    x: pt.x,
                                    y: pt.y,
                                    width: Math.abs(cht.x - pt.x),
                                    height: Math.abs(cht.y - pt.y)
                                },
                                labelRect.Rect,
                                "red", RectConfigs.RECT_THICKNESS);

                                DrawUtils.drawDot(canvas, { x: pt.x, y: pt.y }, "red", 5);
                                DrawUtils.drawDot(canvas, { x: pt.x + Math.abs(cht.x - pt.x), y: pt.y + Math.abs(cht.y - pt.y) }, "red", 5);
                            }
                            return;
                        }
                        DrawUtils.drawRect(canvas, labelRect.Rect, labelRect.Rect, "red", RectConfigs.RECT_THICKNESS);
                        DrawUtils.drawDot(canvas, { x: labelRect.Rect.x, y: labelRect.Rect.y }, "red", 5);
                        DrawUtils.drawDot(canvas, { x: labelRect.Rect.x + labelRect.Rect.width, y: labelRect.Rect.y + labelRect.Rect.height }, "red", 5);
                    }
                }

            });
        }
    }




}