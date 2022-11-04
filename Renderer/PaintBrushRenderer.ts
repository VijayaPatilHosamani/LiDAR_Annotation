import { BaseRenderer } from "./BaseRenderer";
import { RenderConfigs } from "../Configs";
import { LabelTypes } from "../Types";
import { IEditor, IPoint, IRect } from "../Types/Interfaces";
import { RenderUtils, DrawUtils, RectUtils } from "../Utils";
import { LabelLine, LabelsSelector, ImageDataType } from "../Store/Label";
import { store } from "..";
import {
  updateActiveLabelId,
  updateImageDataById,
  updateFirstLabelCreated,
} from "../Store/Label/ActionCreators";
import { EditorActions } from "../Actions";
import { v1 as uuidv1 } from "uuid";
import {
  LabelPaintBrush,
} from "../Store/Label/types";
import { EditorSelector } from "../Store/Editor";
import {
  DoState
} from "../Store/Editor/ActionCreators";

export class PaintBrushRenderer extends BaseRenderer {
  private configs: RenderConfigs = new RenderConfigs();
  private startPoint: IPoint | null;
  private prevStartPoint: IPoint | null;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.labelType = LabelTypes.PAINTBRUSH;
    this.startPoint = null;
    this.prevStartPoint = null;
  }

  arr: any = [];
  // Event Handling

  public keyPressHandler(_data: IEditor): void {

  }

  public mouseMoveHandler(data: IEditor): void {
    let canvasContentImageRect: IRect | null = data.canvasContentImageRect;

    const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
    if (canvasContentImageRect && isMouseOverImage && this.prevStartPoint) {
      const activeLabelId: string | null = LabelsSelector.getActiveLabelId();

      let kt = RenderUtils.transferPointFromCanvasContentToImage(
        this.prevStartPoint,
        data
      );
      let pt = RenderUtils.transferPointFromCanvasContentToImage(
        data.mousePositionOnCanvasContent,
        data
      );

      if (kt && pt) {
        const labelLine: LabelLine = {
          isHidden: false,
          id: uuidv1(),
          labelId: activeLabelId === null ? "" : activeLabelId,
          Line: {
            start: kt,//this.prevStartPoint,
            end: pt,//data.mousePositionOnCanvasContent,
          },
          annotation: null,
          annotationName: undefined
        };
        this.prevStartPoint = data.mousePositionOnCanvasContent;
        this.arr.push(labelLine);
      }
    }
  }
  public mouseDownHandler(data: IEditor): void {
    const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
    const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
    const inprogress = this.isInProgress()
    if (isMouseOverImage && isMouseOverCanvas && !inprogress) {
      this.startLineCreation(data);
    }

  }

  public mouseUpHandler(data: IEditor): void {
    const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
    const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
    const inprogress = this.isInProgress()
    if (isMouseOverImage && isMouseOverCanvas && inprogress) {
      this.endLineCreation(data);
    }

  }

  //Rendering
  public render(data: IEditor): void {
    this.drawActivelyCreatedLines(data);
  }

  public isInProgress(): boolean {
    return !!this.startPoint;
  }

  // draw
  private drawActivelyCreatedLines(data: IEditor) {
    const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
    if (this.startPoint && isMouseOverImage && this.prevStartPoint) {

      if (this.arr.length > 0) {
        this.arr.forEach((element: any) => {
          const startOnCanvas: IPoint | null = //element.Line.start;
            RenderUtils.transferPointFromImageToCanvasContent(
              element.Line.start, // .Line.start,
              data
            );
          const endOnCanvas: IPoint | null =// element.Line.end;
            RenderUtils.transferPointFromImageToCanvasContent(
              element.Line.end, //Line.end,
              data
            );
          if (startOnCanvas && endOnCanvas) {
            DrawUtils.drawLinePaintBrush(
              this.canvas,
              startOnCanvas,// element.Line.start,
              endOnCanvas,//  element.Line.end,
              EditorSelector.getPaintBrushColor(),// 'red', //LineConfigs.LINE_ACTIVE_COLOR,
              EditorSelector.getPaintBrushThickness()//15,//LineConfigs.LINE_THICKNESS
            );
          }

        });
      }

      const lineStartHandle = RectUtils.getRectWithCenterAndSize(
        this.startPoint,
        this.configs.anchorSize
      );
      DrawUtils.drawRectWithFill(
        this.canvas,
        lineStartHandle,
        this.configs.activeAnchorColor
      );
    }
  }

  // get
  // create line
  private startLineCreation = (data: IEditor) => {
    EditorActions.setCanvasActionsDisabledStatus(true);
    this.startPoint = data.mousePositionOnCanvasContent;
    this.prevStartPoint = this.startPoint;
  };

  private endLineCreation = (data: IEditor) => {
    let canvasContentImageRect: IRect | null = data.canvasContentImageRect;
    if (canvasContentImageRect && this.startPoint) {
      const mousePositionOnCanvas: IPoint = RectUtils.keepPointWithinRect(
        data.mousePositionOnCanvasContent

      );
      const startPoint: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(
        this.startPoint,
        data
      );
      const endPoint: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(
        mousePositionOnCanvas,
        data
      );
      const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (startPoint && endPoint && activeLabelId && imageData) {
        this.startPoint = null;
        const labelFreehand: LabelPaintBrush = {
          isHidden: false,
          id: uuidv1(),
          labelId: activeLabelId,
          Lines: this.arr,
          LineColor: EditorSelector.getPaintBrushColor(),// 'red', //LineConfigs.LINE_ACTIVE_COLOR,
          LineThickness: EditorSelector.getPaintBrushThickness(),
          // LineThickness: 15,
          // LineColor:'red',
          annotation: null,
          annotationName: 'PaintBrush' + imageData.labelPaintBrush.length
        };
        imageData.labelPaintBrush.push(labelFreehand);
        store.dispatch(DoState(JSON.stringify(imageData)));
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreated(true));
        store.dispatch(updateActiveLabelId(labelFreehand.id));
        this.arr = [];
        this.startPoint = null;
        this.prevStartPoint = null;
        EditorActions.setCanvasActionsDisabledStatus(false);
      }
    }
  };
}
