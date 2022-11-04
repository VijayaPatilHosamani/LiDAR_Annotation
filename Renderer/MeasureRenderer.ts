import { BaseRenderer } from "./BaseRenderer";
import { RenderConfigs } from "../Configs";
import { LabelTypes } from "../Types";
import { IEditor, IPoint, ILine, ISize } from "../Types/Interfaces";
import { RenderUtils, DrawUtils, RectUtils } from "../Utils";
import { store } from "..";
import { EditorActions } from "../Actions";
import { LineConfigs } from "../Configs/LineConfigs";
import { updateMeasurement } from "../Store/Editor/ActionCreators";

export class MeasureRenderer extends BaseRenderer {

    private configs: RenderConfigs = new RenderConfigs();
    private startPoint: IPoint | null;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.startPoint = null;
        this.labelType = LabelTypes.NONE;
    }


    // Event Handling

    public keyPressHandler(_data: IEditor): void {

    }


    public mouseMoveHandler(_data: IEditor): void {
        // handled by draw active line creation
    }
    public mouseDownHandler(data: IEditor): void {
        const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
        const inprogress = this.isInProgress()
        if (isMouseOverImage && isMouseOverCanvas && !inprogress) {
            EditorActions.setCanvasActionsDisabledStatus(true);
            this.startPoint = RenderUtils.setPointBetweenPixels(data.mousePositionOnCanvasContent)
        }

    }

    public mouseUpHandler(data: IEditor): void {
        const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
        const inprogress = this.isInProgress()
        if (isMouseOverImage && isMouseOverCanvas && inprogress) {
            const line: ILine = { start: this.startPoint, end: data.mousePositionOnCanvasContent }
            let measurement: ISize = { width: Math.abs(line.start.x - line.end.x), height: Math.abs(line.start.y - line.end.y) }
            this.startPoint = null;
            store.dispatch(updateMeasurement(measurement));
            EditorActions.setCanvasActionsDisabledStatus(false);
        }

    }


    //Rendering
    public render(data: IEditor): void {
        this.drawActiveMeasurement(data);
    }

    public isInProgress(): boolean {
        return !!this.startPoint;
    }

    // draw
    private drawActiveMeasurement(data: IEditor) {
        const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);

        if (this.startPoint && isMouseOverImage) {
            const line: ILine = { start: this.startPoint, end: data.mousePositionOnCanvasContent }
            const imageStart: IPoint = RenderUtils.transferPointFromCanvasContentToImage(line.start, data);
            const imageEnd: IPoint = RenderUtils.transferPointFromCanvasContentToImage(line.end, data);
            DrawUtils.drawLine(this.canvas, line.start, line.end, imageStart, imageEnd, LineConfigs.LINE_ACTIVE_COLOR, LineConfigs.LINE_THICKNESS);
            const lineStartHandle = RectUtils.getRectWithCenterAndSize(this.startPoint, this.configs.anchorSize);
            DrawUtils.drawRectWithFill(this.canvas, lineStartHandle, this.configs.activeAnchorColor);
            let measurement: ISize = { width: Math.abs(line.start.x - line.end.x), height: Math.abs(line.start.y - line.end.y) }
            store.dispatch(updateMeasurement(measurement));
        }
    }

}