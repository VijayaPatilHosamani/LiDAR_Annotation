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
import { LineConfigs } from "../Configs/LineConfigs";
import {
  LabelFreehand,
} from "../Store/Label/types";
import {
  DoState
} from "../Store/Editor/ActionCreators";

export class FreehandRenderer extends BaseRenderer {
  private configs: RenderConfigs = new RenderConfigs();
  private startPoint: IPoint | null;
  private prevStartPoint: IPoint | null;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.labelType = LabelTypes.FREEHAND;
    this.startPoint = null;
    this.prevStartPoint = null;
  }

  arr: any = [];
  // Event Handling

  public keyPressHandler(): void {

  }

  public mouseMoveHandler(data: IEditor): void {
    let canvasContentImageRect: IRect | null = data.canvasContentImageRect;

    const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
    const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);

    if (canvasContentImageRect && isMouseOverCanvas && isMouseOverImage && this.prevStartPoint) {
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
            end: pt//data.mousePositionOnCanvasContent,
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
    if (this.startPoint && isMouseOverImage &&  this.prevStartPoint) {

      if (this.arr.length > 0) {
        this.arr.forEach((element: any) => {
          let mt = RenderUtils.transferPointFromImageToCanvasContent(element.Line.start, data);
          let nt = RenderUtils.transferPointFromImageToCanvasContent(element.Line.start, data);
          if (mt && nt) {
            DrawUtils.drawLineFreehand(
              this.canvas,
              mt,//element.Line.start,
              nt,//element.Line.end,
              LineConfigs.LINE_ACTIVE_COLOR,
              LineConfigs.LINE_THICKNESS
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
        data.mousePositionOnCanvasContent);
      const startPoint: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(
        this.startPoint,
        data
      );
      const endPoint: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(
        mousePositionOnCanvas,
        data
      );
      const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (startPoint && endPoint && activeLabelId && imageData) {
        this.startPoint = null;
        const labelFreehand: LabelFreehand = {
          isHidden: false,
          id: uuidv1(),
          labelId: activeLabelId,
          Lines: this.arr,
          annotation: null,
          annotationName: 'Freehand' + imageData.labelFreeHand.length
        };
        imageData.labelFreeHand.push(labelFreehand);
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
