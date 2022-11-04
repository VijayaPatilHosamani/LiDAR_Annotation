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
import { LabelCuboid } from "../Store/Label/types";
import {
  DoState
} from "../Store/Editor/ActionCreators";

export class CuboidRenderer extends BaseRenderer {
  private configs: RenderConfigs = new RenderConfigs();
  private startPoint: IPoint | null;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.labelType = LabelTypes.CUBOID;
    this.startPoint = null;
  }

  arr: any = [];
  rectArray: any = [];
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
          DrawUtils.drawLineCuboid(
            this.canvas,
            standardizedLine.start,
            standardizedLine.end,
            LineConfigs.LINE_INACTIVE_COLOR,
            LineConfigs.LINE_THICKNESS
          );
        }
      });

      DrawUtils.drawLineCuboid(
        this.canvas,
        line.start,
        line.end,
        LineConfigs.LINE_ACTIVE_COLOR,
        LineConfigs.LINE_THICKNESS
      );
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

  private makeCuboid = () => {
    let x1 = this.arr[0].Line.start.x;
    let y1 = this.arr[0].Line.start.y;

    let x3 = this.arr[1].Line.end.x;
    let y3 = this.arr[1].Line.end.y;

    let x2 = 0;
    let x4 = 0;
    let y2 = 0;
    let y4 = 0;

    if (x1 > x3 && y1 > y3) {
      x2 = x3;
      y2 = y1;
      x4 = x1;
      y4 = y3;
    }
    if (x1 < x3 && y1 < y3) {
      x2 = x3;
      y2 = y1;
      x4 = x1;
      y4 = y3;
    }
    if (x1 > x3 && y1 < y3) {
      x2 = x1;
      y2 = y3;

      x4 = x3;
      y4 = y1;
    }
    if (x1 < x3 && y1 > y3) {
      x2 = x1;
      y2 = y3;

      x4 = x3;
      y4 = y1;
    }

    //First Rect start
    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
    });

    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: x2, y: y2 }, end: { x: x3, y: y3 } },
    });

    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: x3, y: y3 }, end: { x: x4, y: y4 } },
    });

    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: x4, y: y4 }, end: { x: x1, y: y1 } },
    });
    //First Rect End

    //Second Rect start
    let xx3 = this.arr[2].Line.end.x;
    let yy3 = this.arr[2].Line.end.y;

    let deltaX = xx3 - x3;
    let deltaY = yy3 - y3;

    let xx1 = x1 + deltaX;
    let yy1 = y1 + deltaY;

    let xx2 = x2 + deltaX;
    let yy2 = y2 + deltaY;

    let xx4 = x4 + deltaX;
    let yy4 = y4 + deltaY;

    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: xx1, y: yy1 }, end: { x: xx2, y: yy2 } },
    });

    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: xx2, y: yy2 }, end: { x: xx3, y: yy3 } },
    });

    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: xx3, y: yy3 }, end: { x: xx4, y: yy4 } },
    });

    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: xx4, y: yy4 }, end: { x: xx1, y: yy1 } },
    });
    //Second Rect End

    //Line connecting Rects

    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: xx1, y: yy1 }, end: { x: x1, y: y1 } },
    });
    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: xx2, y: yy2 }, end: { x: x2, y: y2 } },
    });
    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: xx3, y: yy3 }, end: { x: x3, y: y3 } },
    });
    this.rectArray.push({
      isHidden: false,
      id: uuidv1(),
      labelId: "Polygon" + uuidv1(),
      Line: { start: { x: xx4, y: yy4 }, end: { x: x4, y: y4 } },
    });
  };

  private endLineCreation = (data: IEditor) => {
    let canvasContentImageRect: IRect | null = data.canvasContentImageRect;
    if (canvasContentImageRect && this.startPoint) {
      const mousePositionOnCanvas: IPoint = RectUtils.keepPointWithinRect(
        data.mousePositionOnCanvasContent,
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
      if (startPoint && endPoint && activeLabelId && imageData) {
        const labelLine: LabelLine = {
          id: uuidv1(),
          isHidden: false,
          labelId: activeLabelId,
          Line: { start: startPoint, end: endPoint },
          annotation: null,
          annotationName: undefined,

        };
        this.arr.push(labelLine);
        this.startPoint = endPoint;
        this.startLineCreation(data);
        if (this.arr.length === 3) {
          this.makeCuboid();
          this.startPoint = null;
          const labelCuboid: LabelCuboid = {
            isHidden: false,
            id: uuidv1(),
            labelId: activeLabelId,
            Lines: this.rectArray,
            annotation: null,
            annotationName: 'Cuboid' + imageData.labelCuboid.length
          };

          imageData.labelCuboid.push(labelCuboid);
          this.rectArray = [];
          store.dispatch(DoState(JSON.stringify(imageData)));
          store.dispatch(updateImageDataById(imageData.id, imageData));
          store.dispatch(updateFirstLabelCreated(true));
          store.dispatch(updateActiveLabelId(labelCuboid.id));
          this.arr = [];
        }
        EditorActions.setCanvasActionsDisabledStatus(false);
      }
    }
  };
}
