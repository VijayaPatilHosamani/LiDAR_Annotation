
// import { BaseRenderer } from "./BaseRenderer";
// import { RenderConfigs } from "../Configs";
// import { LabelTypes } from "../Types";
// import { IEditor, IPoint, ILine, IRect } from "../Types/Interfaces";
// import { RenderUtils, DrawUtils, RectUtils } from "../Utils";
// import { LabelLine, LabelsSelector, ImageDataType } from "../Store/Label";
// import { store } from "..";
// import { updateActiveLabelId, updateHighlightedLabelId, updateImageDataById, updateFirstLabelCreated } from "../Store/Label/ActionCreators";
// import { LineAnchorTypes } from "../Types/LineAnchorTypes";
// import { EditorActions } from "../Actions";
// import { v1 as uuidv1 } from 'uuid';
// import { LineConfigs } from "../Configs/LineConfigs";




// export class LineRenderer extends BaseRenderer {

//     private configs: RenderConfigs = new RenderConfigs();
//     private startPoint: IPoint | null;
//     private lineStartAnchorType: LineAnchorTypes | null;

//     public constructor(canvas: HTMLCanvasElement) {
//         super(canvas);
//         this.labelType = LabelTypes.LINE;
//         this.startPoint = null;
//         this.lineStartAnchorType = null;
//     }


//     // Event Handling
//     public mouseMoveHandler(data: IEditor): void {

//         const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
//         if (isMouseOverImage) {
//             const labelLine: LabelLine | null = this.getLineUnderMouse(data);
//             if (labelLine) {
//                 if (LabelsSelector.getHighlightedLabelId() !== labelLine.id) {
//                     store.dispatch(updateHighlightedLabelId(labelLine.id));
//                 }
//             }
//             else {
//                 if (LabelsSelector.getHighlightedLabelId !== null) {
//                     store.dispatch(updateHighlightedLabelId(null));
//                 }
//             }
//         }
//     }
//     public mouseDownHandler(data: IEditor): void {
//         const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
//         const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
//         const anchorTypeUnderMouse: LineAnchorTypes | null = this.getAnchorTypeUnderMouse(data);
//         if (isMouseOverCanvas && isMouseOverImage) {
//             const labelLineUnderMouse: LabelLine | null = this.getLineUnderMouse(data);
//             if (labelLineUnderMouse) {
//                 if (anchorTypeUnderMouse && this.lineStartAnchorType) {
//                     store.dispatch(updateActiveLabelId(labelLineUnderMouse.id));
//                     this.lineStartAnchorType = anchorTypeUnderMouse;
//                     EditorActions.setCanvasActionsDisabledStatus(true);
//                 }
//                 else {
//                     store.dispatch(updateActiveLabelId(labelLineUnderMouse.id))
//                 }
//             }
//             else if (!this.isInProgress()) {
//                 this.startLabelCreation(data);
//             }
//             else {
//                 this.endLabelCreation(data)
//             }
//         }

//     }
//     public mouseUpHandler(data: IEditor): void {
//         if (this.lineStartAnchorType) {
//             const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
//             const activeLabel: LabelLine | null = LabelsSelector.getActiveLineLabel();
//             const canvasContentImageRect: IRect | null = data.canvasContentImageRect;
//             if (canvasContentImageRect && imageData && activeLabel) {
//                 imageData.labelLines = imageData.labelLines.map((lineLabel: LabelLine) => {
//                     if (lineLabel.id !== activeLabel.id) {
//                         return lineLabel
//                     } else {
//                         const mousePosition: IPoint =
//                             RectUtils.keepPointWithinRect(data.mousePositionOnCanvasContent, canvasContentImageRect);
//                         const mousePositionOnImage = RenderUtils.transferPointFromCanvasContentToImage(
//                             mousePosition, data
//                         );
//                         return {
//                             ...lineLabel,
//                             line: {
//                                 start: this.lineStartAnchorType === LineAnchorTypes.START ? mousePositionOnImage : lineLabel.Line.start,
//                                 end: this.lineStartAnchorType === LineAnchorTypes.END ? mousePositionOnImage : lineLabel.Line.end
//                             }
//                         }
//                     }
//                 });

//                 store.dispatch(updateImageDataById(imageData.id, imageData));
//                 store.dispatch(updateActiveLabelId(activeLabel.id));
//             }
//             this.lineStartAnchorType = null;
//             EditorActions.setCanvasActionsDisabledStatus(false);
//         }
//     }

//     //Rendering
//     public render(data: IEditor): void {
//         this.drawActivelyCreatedLines(data);
//         this.drawActivelyResizeLabel(data);

//     }

//     public isInProgress(): boolean {
//         return !!this.startPoint;
//     }


//     // Helpers
//     private isMouseOverAnchor(mouse: IPoint, anchor: IPoint): boolean {
//         if (mouse && anchor) {
//             let mouseOverAnchor: boolean | null = RectUtils.isPointInside(RectUtils.getRectWithCenterAndSize(anchor, this.configs.suggestedAnchorDetectionSize), mouse);
//             if (mouseOverAnchor) {
//                 return mouseOverAnchor;
//             }
//         }
//         return false;
//     }

//     // draw

//     private drawActivelyCreatedLines(data: IEditor) {

//         if (this.startPoint) {
//             const line: ILine = { start: this.startPoint, end: data.mousePositionOnCanvasContent }
//             DrawUtils.drawLine(this.canvas, line.start, line.end, LineConfigs.LINE_ACTIVE_COLOR, LineConfigs.LINE_THICKNESS);
//             const lineStartHandle = RectUtils.getRectWithCenterAndSize(this.startPoint, this.configs.anchorSize);
//             DrawUtils.drawRectWithFill(this.canvas, lineStartHandle, this.configs.activeAnchorColor);
//         }
//     }

//     private drawActivelyResizeLabel(data: IEditor) {
//         const activeLabelLine: LabelLine | null = LabelsSelector.getActiveLineLabel();
//         let canvasContentImageRect: IRect | null = data.canvasContentImageRect;
//         if (!!activeLabelLine && canvasContentImageRect) {
//             const snappedMousePosition: IPoint =
//                 RectUtils.keepPointWithinRect(data.mousePositionOnCanvasContent, canvasContentImageRect);
//             const startPoint: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(activeLabelLine.Line.start, data);
//             const endPoint: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(activeLabelLine.Line.end, data)
//             if (startPoint && endPoint && this.lineStartAnchorType) {
//                 const lineOnCanvas: ILine = { start: startPoint, end: endPoint }
//                 const lineToDraw = {
//                     start: this.lineStartAnchorType === LineAnchorTypes.START ? snappedMousePosition : lineOnCanvas.start,
//                     end: this.lineStartAnchorType === LineAnchorTypes.END ? snappedMousePosition : lineOnCanvas.end
//                 }

//                 const standardizedLine: ILine = {
//                     start: RenderUtils.setPointBetweenPixels(lineToDraw.start),
//                     end: RenderUtils.setPointBetweenPixels(lineToDraw.end)
//                 }
//                 DrawUtils.drawLine(this.canvas, standardizedLine.start, standardizedLine.end, LineConfigs.LINE_ACTIVE_COLOR, LineConfigs.LINE_THICKNESS);

//                 [standardizedLine.start, standardizedLine.end].map((point: IPoint) => RectUtils.getRectWithCenterAndSize(point, this.configs.anchorSize))
//                     .forEach((handleRect: IRect) => {
//                         DrawUtils.drawRectWithFill(this.canvas, handleRect, this.configs.activeAnchorColor);
//                     })
//             }
//         }
//     }


//     // get

//     private getLineUnderMouse(data: IEditor): LabelLine | null {
//         const activeImageData: ImageDataType | null = LabelsSelector.getActiveImageData();
//         if (activeImageData) {
//             const labelLines: LabelLine[] = activeImageData.labelLines;
//             for (let i = 0; i < labelLines.length; i++) {
//                 const startOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelLines[i].Line.start, data);
//                 const endOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelLines[i].Line.end, data);
//                 if (startOnCanvas && endOnCanvas) {
//                     const lineOnCanvas: ILine = { start: startOnCanvas, end: endOnCanvas }

//                     const mouseOverLine = RenderUtils.isMouseOverLine(
//                         data.mousePositionOnCanvasContent,
//                         lineOnCanvas,
//                         this.configs.anchorHoverSize.width / 2
//                     )
//                     if (mouseOverLine) {
//                         return labelLines[i];
//                     }
//                 }
//             }
//         }
//         return null

//     }

//     private getAnchorTypeUnderMouse(data: IEditor): LineAnchorTypes | null {
//         const activeImageData: ImageDataType | null = LabelsSelector.getActiveImageData();
//         if (activeImageData) {
//             const labelLines: LabelLine[] = activeImageData.labelLines;
//             for (let i = 0; i < labelLines.length; i++) {
//                 const startOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelLines[i].Line.start, data)
//                 const endOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(labelLines[i].Line.end, data)
//                 if (startOnCanvas && this.isMouseOverAnchor(data.mousePositionOnCanvasContent, startOnCanvas)) {
//                     return LineAnchorTypes.START
//                 }
//                 if (endOnCanvas && this.isMouseOverAnchor(data.mousePositionOnCanvasContent, endOnCanvas)) {
//                     return LineAnchorTypes.END
//                 }
//             }
//         }
//         return null;
//     }


//     // create
//     private startLabelCreation = (data: IEditor) => {
//         this.startPoint = RenderUtils.setPointBetweenPixels(data.mousePositionOnCanvasContent)
//         EditorActions.setCanvasActionsDisabledStatus(true);
//     }

//     private endLabelCreation = (data: IEditor) => {
//         let canvasContentImageRect: IRect | null = data.canvasContentImageRect;
//         if (canvasContentImageRect && this.startPoint) {
//             const mousePositionOnCanvas: IPoint = RectUtils.keepPointWithinRect(
//                 data.mousePositionOnCanvasContent, canvasContentImageRect
//             );
//             const startOnImage: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(this.startPoint, data)
//             const endOnImage: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(mousePositionOnCanvas, data)
//             const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
//             const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
//             if (startOnImage && endOnImage && activeLabelId && imageData) {

//                 const labelLine: LabelLine = {
//                     id: uuidv1(),
//                     labelId: activeLabelId,
//                     Line: { start: startOnImage, end: endOnImage }
//                 };
//                 imageData.labelLines.push(labelLine);
//                 store.dispatch(updateImageDataById(imageData.id, imageData));
//                 store.dispatch(updateFirstLabelCreated(true));
//                 store.dispatch(updateActiveLabelId(labelLine.id));
//                 this.startPoint = null
//                 EditorActions.setCanvasActionsDisabledStatus(false);
//             }
//         }
//     };

//     public cancelLabelCreation() {
//         this.startPoint = null
//         EditorActions.setCanvasActionsDisabledStatus(false);
//     }

// }