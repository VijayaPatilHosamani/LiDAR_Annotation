import { store } from '..'
import { IPoint, IEditor } from "../Types/Interfaces";
import { RenderUtils, DrawUtils } from ".";
import { PointConfigs } from "../Configs/PointConfigs";
import { LabelsSelector, ImageDataType, LabelPoint } from "../Store/Label";

export class PointUtils {
    public static equals(point1: IPoint, point2: IPoint): boolean {
        return (point1.x === point2.x && point1.y === point2.y);
    }

    public static add(point1: IPoint, point2: IPoint): IPoint {
        return {
            x: point1.x + point2.x,
            y: point1.y + point2.y
        }
    }

    public static subtract(point1: IPoint, point2: IPoint): IPoint {
        return {
            x: point1.x - point2.x,
            y: point1.y - point2.y
        }
    }

    public static multiply(point1: IPoint, factor: number): IPoint {
        return {
            x: point1.x * factor,
            y: point1.y * factor
        }
    }

    public static drawExistingPoints(canvas: HTMLCanvasElement, data: IEditor) {

        const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
        const highlightedLabelId: string | null = LabelsSelector.getHighlightedLabelId();
        const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
        if (imageData) {
            imageData.labelPoints.forEach((labelPoint: LabelPoint) => {
                let kt = store.getState().labels.inEditLabelId;
                if (!labelPoint.isHidden && !(store.getState().labels.isEditMode === true && kt === labelPoint.id)) {
                    const isActive: boolean = activeLabelId !== null && labelPoint.id === activeLabelId;
                    const isHighlighted: boolean = highlightedLabelId !== null && labelPoint.id === highlightedLabelId;
                    const pointOnImage: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelPoint.Point, data);
                    if (!isActive && !isHighlighted && pointOnImage) {
                        const standardizedPoint = RenderUtils.setPointBetweenPixels(pointOnImage);
                        DrawUtils.drawDot(canvas, standardizedPoint, PointConfigs.POINT_INACTIVE_COLOR, PointConfigs.POINT_THICKNESS)
                    }
                }


                if ((store.getState().labels.isEditMode === true && kt === labelPoint.id)) {
                    const isActive: boolean = activeLabelId !== null && labelPoint.id === activeLabelId;
                    const isHighlighted: boolean = highlightedLabelId !== null && labelPoint.id === highlightedLabelId;
                    const pointOnImage: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelPoint.Point, data);
                    if (!isActive && !isHighlighted && pointOnImage) {
                        const standardizedPoint = RenderUtils.setPointBetweenPixels(pointOnImage);
                        DrawUtils.drawDot(canvas, standardizedPoint, "red", PointConfigs.POINT_THICKNESS)
                    }
                }



            });
        }
    }
}