/* eslint-disable @typescript-eslint/no-unused-vars */
import { store } from '..'
import { ILine, IPoint, IEditor } from "../Types/Interfaces";
import { LabelsSelector, ImageDataType } from "../Store/Label";
import { RenderUtils, DrawUtils } from ".";
import { LineConfigs } from "../Configs/LineConfigs";
import { LabelCircle } from "../Store/Label/types";

export class CircleUtils {
    public static getDistanceFromLine(line: ILine, point: IPoint): number | null {
        if (line.start.x !== line.end.x || line.start.y !== line.end.y) {
            const denom: number = Math.sqrt(Math.pow(line.end.y - line.start.y, 2) + Math.pow(line.end.x - line.start.x, 2));
            const nom: number = Math.abs((line.end.y - line.start.y) * point.x - (line.end.x - line.start.x) * point.y + line.end.x * line.start.y - line.end.y * line.start.x);
            return nom / denom;
        }
        return null;
    }

    public static getCenterPoint(line: ILine): IPoint {
        return {
            x: (line.start.x + line.end.x) / 2,
            y: (line.start.y + line.end.y) / 2
        }
    }

    public static drawExistingCircles(canvas: HTMLCanvasElement, data: IEditor): void {
        const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
        if (imageData) {
            imageData.labelCircles.forEach((labelLine: LabelCircle) => {
                // if (!labelLine.isHidden) {
                let kt = store.getState().labels.inEditLabelId;
                if (!labelLine.isHidden && !(store.getState().labels.isEditMode === true && kt === labelLine.id)) {

                    const startOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelLine.Line.start, data);
                    const endOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelLine.Line.end, data);
                    if (startOnCanvas && endOnCanvas) {
                        const standardizedLine: ILine = {
                            start: RenderUtils.setPointBetweenPixels(startOnCanvas),
                            end: RenderUtils.setPointBetweenPixels(endOnCanvas)
                        }
                        const imageStart: IPoint = RenderUtils.transferPointFromCanvasContentToImage(startOnCanvas, data);
                        const imageEnd: IPoint = RenderUtils.transferPointFromCanvasContentToImage(endOnCanvas, data);
                        DrawUtils.drawCircle(canvas, standardizedLine.start, standardizedLine.end,
                            imageStart, imageEnd,
                            LineConfigs.LINE_INACTIVE_COLOR, LineConfigs.LINE_THICKNESS);
                    }
                }


                if ((store.getState().labels.isEditMode === true && kt === labelLine.id)) {
                    const startOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelLine.Line.start, data);
                    const endOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelLine.Line.end, data);
                    if (startOnCanvas && endOnCanvas) {
                        const standardizedLine: ILine = {
                            start: RenderUtils.setPointBetweenPixels(startOnCanvas),
                            end: RenderUtils.setPointBetweenPixels(endOnCanvas)
                        }
                        const imageStart: IPoint = RenderUtils.transferPointFromCanvasContentToImage(startOnCanvas, data);
                        const imageEnd: IPoint = RenderUtils.transferPointFromCanvasContentToImage(endOnCanvas, data);
                        DrawUtils.drawCircle(canvas, standardizedLine.start, standardizedLine.end, imageStart, imageEnd, "Red", LineConfigs.LINE_THICKNESS);
                    }
                }




            });
        }
    }
}