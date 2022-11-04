import { BaseRenderer } from "./BaseRenderer";
import { RenderConfigs } from "../Configs";
import { LabelTypes } from "../Types";
import { IEditor, IPoint, ILine, IRect } from "../Types/Interfaces";
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
import { LabelSegmentation } from "../Store/Label/types";
import {
  DoState
} from "../Store/Editor/ActionCreators";
var randomColor = require('randomcolor');

export class SegmentationRenderer extends BaseRenderer {
  private configs: RenderConfigs = new RenderConfigs();
  private startPoint: IPoint | null;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.labelType = LabelTypes.SEGMENTATION;
    this.startPoint = null;
  }

  arr: any = [];
  // Event Handling
  public keyPressHandler(data: IEditor): void {
    if (data !== undefined) {
      var cht = data.event.key;
      if (cht === "Enter") {
        this.endLineCreation(data);
      }
      else if (cht === "Escape") {
        this.startPoint = null;
        this.arr = [];
      }
    }
  }

  public mouseMoveHandler(_data: IEditor): void {
    // handled by draw active line creation
  }
  public mouseDownHandler(data: IEditor): void {
    const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
    const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
    const inprogress = this.isInProgress()
    if (isMouseOverImage && isMouseOverCanvas) {
      if(!inprogress) {
        this.startLineCreation(data);
      }
      else{
        this.addLineCreation(data);
      }
    }
  }

  public mouseUpHandler(data: IEditor): void {
    //const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
    //const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
    //const inprogress = this.isInProgress()
    //if (isMouseOverImage && isMouseOverCanvas && inprogress) {
      //this.endLineCreation(data);
    //}
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
    if (this.startPoint && isMouseOverImage) {
      const line: ILine = {
        start: this.startPoint,
        end: data.mousePositionOnCanvasContent,
      };

      this.arr.forEach((labelLine: LabelLine) => {
        const startOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(
          labelLine.Line.start,
          data
        );
        const endOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(
          labelLine.Line.end,
          data
        );
        if (startOnCanvas && endOnCanvas) {
          const standardizedLine: ILine = {
            start: RenderUtils.setPointBetweenPixels(startOnCanvas),
            end: RenderUtils.setPointBetweenPixels(endOnCanvas),
          };
          DrawUtils.drawLinePolygon(
            this.canvas,
            standardizedLine.start,
            standardizedLine.end,
            LineConfigs.LINE_INACTIVE_COLOR,
            LineConfigs.LINE_THICKNESS
          );
        }
      });

      DrawUtils.drawLinePolygon(
        this.canvas,
        line.start,
        line.end,
        LineConfigs.LINE_ACTIVE_COLOR,
        LineConfigs.LINE_THICKNESS
      );


      if(this.arr.length > 0) {
          const startOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(
            this.arr[0].Line.start,
            data
          );
          const endOnCanvas: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(
            this.arr[this.arr.length - 1].Line.end,
            data
          );
          if (startOnCanvas && endOnCanvas) {
            const standardizedLine: ILine = {
              start: RenderUtils.setPointBetweenPixels(startOnCanvas),
              end: RenderUtils.setPointBetweenPixels(endOnCanvas),
            };

          DrawUtils.drawLinePolygon(
            this.canvas,
            standardizedLine.start,
            standardizedLine.end,
            LineConfigs.LINE_INACTIVE_COLOR,
            LineConfigs.LINE_THICKNESS - 1
          );
        }
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
    this.startPoint = RenderUtils.setPointBetweenPixels(
      data.mousePositionOnCanvasContent
    );
  };

  private addLineCreation = (data: IEditor) => {
    let canvasContentImageRect: IRect | null = data.canvasContentImageRect;
    if (canvasContentImageRect && this.startPoint) {
      const mousePositionOnCanvas: IPoint = RectUtils.keepPointWithinRect(
        data.mousePositionOnCanvasContent
      );
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

      if (
        this.arr.length > 0 && endPoint &&
        Math.abs(endPoint.x - this.arr[0].Line.start.x) < 5 &&
        Math.abs(endPoint.y - this.arr[0].Line.start.y) < 5
      ) {
        this.endLineCreation(data);
      }
      else if (startPoint && endPoint && activeLabelId && imageData) {
        const labelLine: LabelLine = {
          isHidden: false,
          id: uuidv1(),
          labelId: activeLabelId,
          Line: { start: startPoint, end: endPoint },
          annotation: null,
          annotationName: undefined
        };
        this.arr.push(labelLine);
        this.startPoint = RenderUtils.setPointBetweenPixels(data.mousePositionOnCanvasContent);
        this.startLineCreation(data);
      }
    }
  }

  private endLineCreation = (data: IEditor) => {
    if (this.startPoint && this.arr.length > 1) {
      const startPoint: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(
        this.startPoint,
        data
      );
      const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (startPoint &&  activeLabelId && imageData) {
        let end = this.arr[0].Line.start
        const labelLine: LabelLine = {
          isHidden: false,
          id: uuidv1(),
          labelId: activeLabelId,
          Line: { start: startPoint, end: end },
          annotation: null,
          annotationName: undefined
        };
        this.arr.push(labelLine);
        this.startPoint = null;
        const labelPolygon: LabelSegmentation = {
          isHidden: false,
          id: uuidv1(),
          labelId: activeLabelId,
          Lines: this.arr,
          LineColor: randomColor(),//"red",
          annotation: null,
          annotationName: 'Segment' + imageData.labelSegmentation.length
        };
        imageData.labelSegmentation.push(labelPolygon);
        store.dispatch(DoState(JSON.stringify(imageData)));
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreated(true));
        store.dispatch(updateActiveLabelId(labelPolygon.id));
        this.arr = [];
        EditorActions.setCanvasActionsDisabledStatus(false);
      }
    }
  };
}
