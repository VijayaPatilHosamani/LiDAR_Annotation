/* eslint-disable @typescript-eslint/no-unused-vars */
import { RenderConfigs } from "../Configs";
import { LabelTypes } from "../Types";
import { BaseRenderer } from "./BaseRenderer";
import { IEditor, IRect, IPoint, } from "../Types/Interfaces";
import { EditorManager } from "../Managers";
import { RenderUtils, RectUtils, DrawUtils } from "../Utils";
import { ImageDataType, LabelsSelector, LabelPoint } from "../Store/Label";
import { store } from "..";
import { updateImageDataById, updateFirstLabelCreated, updateActiveLabelId, updateHighlightedLabelId } from "../Store/Label/ActionCreators";
import { v1 as uuidv1 } from 'uuid';
import { EditorActions } from "../Actions/EditorActions";
import { PointConfigs } from "../Configs/PointConfigs";


export class EditRenderer extends BaseRenderer {

    private configs: RenderConfigs = new RenderConfigs();

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.labelType = LabelTypes.POINT;
    }

    public keyPressHandler(_data: IEditor): void {

    }

    // Event handling
    public mouseMoveHandler(data: IEditor): void {
        const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);

        if (isMouseOverImage && isMouseOverCanvas) {
            const labelPoint: LabelPoint | null = this.getLabelPointUnderMouse(data.mousePositionOnCanvasContent, data);
            const currentHighLightedLabelId: string | null = LabelsSelector.getHighlightedLabelId();
            if (labelPoint) {
                if (currentHighLightedLabelId !== labelPoint.id) {
                    store.dispatch(updateHighlightedLabelId(labelPoint.id));
                }
            }
            else {
                if (currentHighLightedLabelId !== null) {
                    store.dispatch(updateHighlightedLabelId(null));
                }
            }

        }


    }
    public mouseDownHandler(data: IEditor): void {
        const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);

        if (isMouseOverCanvas) {
            const labelPoint: LabelPoint | null = this.getLabelPointUnderMouse(data.mousePositionOnCanvasContent, data);
            if (labelPoint) {
                const pointOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelPoint.Point, data);
                if (pointOnCanvas) {
                    const pointBetweenPixels: IPoint | null = RenderUtils.setPointBetweenPixels(pointOnCanvas);
                    if (pointBetweenPixels) {
                        const handleRect: IRect = RectUtils.getRectWithCenterAndSize(pointBetweenPixels, this.configs.anchorHoverSize);

                        if (RectUtils.isPointInside(handleRect, data.mousePositionOnCanvasContent)) {
                            store.dispatch(updateActiveLabelId(labelPoint.id));
                            EditorActions.setCanvasActionsDisabledStatus(true);
                            return;
                        }

                        else {
                            store.dispatch(updateActiveLabelId(null));
                            const pointOnImage: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(data.mousePositionOnCanvasContent, data);
                            if (pointOnImage) {
                                this.addNewPointLabel(pointOnImage);
                            }
                        }
                    }
                }
            }
            else if (isMouseOverImage) {
                const pointOnImage: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(data.mousePositionOnCanvasContent, data);
                if (pointOnImage) {
                    this.addNewPointLabel(pointOnImage);
                }
            }
        }
    }


    public mouseUpHandler(data: IEditor): void {
        const canvasContentImageRect: IRect | null = data.canvasContentImageRect;
        const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
        const activeLabelPoint = LabelsSelector.getActivePointLabel()
        const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);


        if (this.isInProgress() && activeLabelPoint && canvasContentImageRect && imageData && isMouseOverCanvas) {
            const pointInRect: IPoint = RectUtils.keepPointWithinRect(data.mousePositionOnCanvasContent);
            const pointOnImage: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(pointInRect, data);

            if (pointOnImage) {
                imageData.labelPoints = imageData.labelPoints.map((labelPoint: LabelPoint) => {
                    if (labelPoint.id === activeLabelPoint.id) {
                        return {
                            ...labelPoint,
                            Point: pointOnImage
                        };
                    }
                    return labelPoint;
                });
                store.dispatch(updateImageDataById(imageData.id, imageData));
            }
        }
        EditorActions.setCanvasActionsDisabledStatus(false);
    }


    //  Rendering
    public render(data: IEditor): void {
        let activeLabelId: string | null = LabelsSelector.getActiveLabelId();
        let highlightedLabelId: string | null = LabelsSelector.getHighlightedLabelId();
        let imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
        let mousePositionOnCanvasContent: IPoint | null = data.mousePositionOnCanvasContent;
        let canvasContentImageRect: IRect | null = data.canvasContentImageRect;

        if (imageData && canvasContentImageRect && mousePositionOnCanvasContent) {
            let mousePosition: IPoint = mousePositionOnCanvasContent;
            imageData.labelPoints.forEach((labelPoint: LabelPoint) => {
                if (labelPoint.id === activeLabelId || labelPoint.id === highlightedLabelId) {
                    if (this.isInProgress()) {
                        const pointSnapped: IPoint = RectUtils.keepPointWithinRect(mousePosition);
                        const pointBetweenPixels: IPoint = RenderUtils.setPointBetweenPixels(pointSnapped);

                        DrawUtils.drawDot(this.canvas, pointBetweenPixels, this.configs.activeAnchorColor)
                    } else {
                        this.renderActivePoint(labelPoint, data);
                    }
                }
            });
        }
    }

    isInProgress(): boolean {
        return EditorManager.CanvasActionsDisabled;
    }

    //helpers

    private getLabelPointUnderMouse(mousePosition: IPoint, data: IEditor): LabelPoint | null {
        const ActiveImage: ImageDataType | null = LabelsSelector.getActiveImageData()
        if (ActiveImage) {

            const labelPoints: LabelPoint[] = ActiveImage.labelPoints;
            for (let i = 0; i < labelPoints.length; i++) {
                const pointOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelPoints[i].Point, data);
                if (pointOnCanvas) {
                    const handleRect: IRect = RectUtils.getRectWithCenterAndSize(pointOnCanvas, this.configs.anchorHoverSize);
                    if (RectUtils.isPointInside(handleRect, mousePosition)) {
                        return labelPoints[i];
                    }
                }
            }
        }
        return null;
    }
    private addNewPointLabel = (point: IPoint): void => {
        const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
        const activeImageData: ImageDataType | null = LabelsSelector.getActiveImageData();
        if (activeImageData && activeLabelId) {
            const newLabelPoint: LabelPoint = {
                isHidden: false,
                id: uuidv1(),
                labelId: activeLabelId,
                Point: point,
                annotation: null,
                annotationName: undefined
            };
            activeImageData.labelPoints.push(newLabelPoint);
            store.dispatch(updateImageDataById(activeImageData.id, activeImageData));
            store.dispatch(updateActiveLabelId(newLabelPoint.id));
            if (!LabelsSelector.getFirstActiveLabel()) {
                store.dispatch(updateFirstLabelCreated(true));
            }

        }

    }

    private renderActivePoint(labelPoint: LabelPoint, data: IEditor) {
        const pointOnImage: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelPoint.Point, data);
        if (pointOnImage) {
            const standardizedPoint = RenderUtils.setPointBetweenPixels(pointOnImage);
            DrawUtils.drawDot(this.canvas, standardizedPoint, PointConfigs.POINT_ACTIVE_COLOR, PointConfigs.POINT_THICKNESS)
        }
    }



}