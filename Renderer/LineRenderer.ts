import { EditorManager } from "../../src/Managers";
import { CanvasUtils } from "../../src/Utils";
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
  updateActiveLabelType,
  deactivate_EditMode,
  activateEditMode,
} from "../Store/Label/ActionCreators";
import { EditorActions } from "../Actions";
import { v1 as uuidv1 } from "uuid";
import { LineConfigs } from "../Configs/LineConfigs";
import {
  DoState,
  updateActiveUtilType,
} from "../Store/Editor/ActionCreators";

export class LineRenderer extends BaseRenderer {
  private configs: RenderConfigs = new RenderConfigs();
  private startPoint: IPoint | null;
  private isInEditMode: boolean = false;
  private editStartPoint: any = null;
  private editEndPoint: any = null;

  private editObject: LabelLine | null = null;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.labelType = LabelTypes.LINE;
    this.startPoint = null;
    this.isInEditMode = store.getState().labels.isEditMode;
    if (this.isInEditMode && store.getState().labels.inEditLabelId !== null) {
      // alert("InEdit Mode");
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (imageData !== null) {
        let kt = store.getState().labels.inEditLabelId;
        imageData.labelLines.forEach((labelLine: LabelLine) => {
          if (kt === labelLine.id) {
            this.editObject = labelLine;
            store.dispatch(updateActiveLabelType(LabelTypes.NONE));
            store.dispatch(updateActiveLabelType(LabelTypes.LINE));
          }
        });
      }
    }
  }

  public keyPressHandler(data: IEditor): void {
    if (data !== undefined) {
      var cht = data.event.key;
      if (this.isInEditMode && cht === "Escape" && this.editObject !== null) {
        store.dispatch(deactivate_EditMode(this.editObject.id));
        store.dispatch(updateActiveLabelType(LabelTypes.NONE));
        store.dispatch(updateActiveLabelType(LabelTypes.LINE));
      }
    }
  }

  public CheckEdit(data: any, mousePosition: any) {
    var PointClick: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(
      mousePosition,
      data
    );
    const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();

    if (imageData !== null && PointClick !== null) {
      imageData.labelLines.forEach((labelLine: LabelLine) => {
        var P1: any = labelLine.Line.start;
        var P2: any = labelLine.Line.end;
        var distOfLine = Math.sqrt(
          Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2)
        );
        P1 = labelLine.Line.start;
        P2 = PointClick;
        var distAC = Math.sqrt(
          Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2)
        );
        P1 = labelLine.Line.end;
        var distCB = Math.sqrt(
          Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2)
        );
        if (
          distOfLine - 10 < distAC + distCB &&
          distAC + distCB < distOfLine + 10
        ) {
          store.dispatch(updateActiveUtilType(null));
          store.dispatch(updateActiveLabelType(LabelTypes.NONE));
          store.dispatch(activateEditMode(labelLine.id));
          store.dispatch(updateActiveLabelType(LabelTypes.LINE));
          //return;
        }
      });
    }
  }

  // Event Handling
  public mouseMoveHandler(_data: IEditor): void {
    // handled by draw active line creation
  }
  public mouseDownHandler(data: IEditor): void {
    if (data.event.shiftKey && EditorManager.canvas !== null) {
      const mousePosition = CanvasUtils.getMousePositionOnCanvasFromEvent(
        data.event,
        EditorManager.canvas
      );
      this.CheckEdit(data, mousePosition);
      // return;
    }
    else {

      if (this.isInEditMode) {
        this.editStartPoint = RenderUtils.setPointBetweenPixels(
          data.mousePositionOnCanvasContent
        );
      } else {
        const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
        const inprogress = this.isInProgress()
        if (isMouseOverImage && isMouseOverCanvas && !inprogress) {
          this.startLineCreation(data);
        }

      }
    }
  }

  distBetweenPoints = (P1: any, P2: any) => {
    return Math.sqrt(Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2));
  };

  public mouseUpHandler(data: IEditor): void {
    if (this.isInEditMode) {
      this.editEndPoint = data.mousePositionOnCanvasContent;
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();

      if (this.editStartPoint !== null && this.editObject !== null && imageData) {
        var ed = RenderUtils.transferPointFromCanvasContentToImage(
          this.editStartPoint,
          data
        );
        if (ed !== null && this.editObject !== null) {
          if (
            Math.abs(this.editObject.Line.start.x - ed.x) < 10 &&
            Math.abs(this.editObject.Line.start.y - ed.y) < 10 &&
            this.editObject !== null
          ) {
            var cht = RenderUtils.transferPointFromCanvasContentToImage(
              this.editEndPoint,
              data
            );
            if (cht !== null) {
              this.editObject.Line.start = cht;
              store.dispatch(updateImageDataById(imageData.id, imageData));
            }
          }
          if (
            Math.abs(this.editObject.Line.end.x - ed.x) < 10 &&
            Math.abs(this.editObject.Line.end.y - ed.y) < 10 &&
            this.editObject !== null
          ) {
            var cht2 = RenderUtils.transferPointFromCanvasContentToImage(
              this.editEndPoint,
              data
            );
            if (cht2 !== null) {
              this.editObject.Line.end = cht2;
              store.dispatch(updateImageDataById(imageData.id, imageData));
            }
          }
        }
      }
    } else {
      const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
      const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
      const inprogress = this.isInProgress()
      if (isMouseOverImage && isMouseOverCanvas && inprogress) {
        this.endLineCreation(data);
      }

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
    if (
      this.isInEditMode &&
      this.editObject !== null &&
      store.getState().labels.inEditLabelId !== null
    ) {
      var st = RenderUtils.transferPointFromImageToCanvasContent(
        this.editObject.Line.start,
        data
      );

      var ed = RenderUtils.transferPointFromImageToCanvasContent(
        this.editObject.Line.end,
        data
      );
      if (st !== null && ed !== null) {
        const line: ILine = { start: st, end: ed };

        const imageStart: IPoint = RenderUtils.transferPointFromCanvasContentToImage(st, data);
        const imageEnd: IPoint = RenderUtils.transferPointFromCanvasContentToImage(ed, data);
        DrawUtils.drawLine(
          this.canvas,
          line.start,
          line.end,
          imageStart,
          imageEnd,
          "red",
          LineConfigs.LINE_THICKNESS
        );
      }
    } else {
      const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
      if (this.startPoint && isMouseOverImage ) {
        const line: ILine = {
          start: this.startPoint,
          end: data.mousePositionOnCanvasContent,
        };
        const imageStart: IPoint = RenderUtils.transferPointFromCanvasContentToImage(line.start, data);
        const imageEnd: IPoint = RenderUtils.transferPointFromCanvasContentToImage(line.end, data);
        DrawUtils.drawLine(
          this.canvas,
          line.start,
          line.end,
          imageStart,
          imageEnd,
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
  }

  // get
  // create line
  private startLineCreation = (data: IEditor) => {
    EditorActions.setCanvasActionsDisabledStatus(true);
    this.startPoint = RenderUtils.setPointBetweenPixels(
      data.mousePositionOnCanvasContent
    );
  };

  private endLineCreation = (data: IEditor) => {
    if (!this.isInEditMode) {
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
        if (startPoint && endPoint && activeLabelId && imageData) {
          const labelLine: LabelLine = {
            isHidden: false,
            id: uuidv1(),
            labelId: uuidv1(), //activeLabelId,
            Line: { start: startPoint, end: endPoint },
            annotation: null,
            annotationName: "Line" + imageData.labelLines.length,
          };
          imageData.labelLines.push(labelLine);
          store.dispatch(DoState(JSON.stringify(imageData)));
          store.dispatch(updateImageDataById(imageData.id, imageData));
          store.dispatch(updateFirstLabelCreated(true));
          store.dispatch(updateActiveLabelId(labelLine.id));
          this.startPoint = null;
          EditorActions.setCanvasActionsDisabledStatus(false);
        }
      }
    }
  };
}
