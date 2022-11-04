import { CanvasUtils } from "../../src/Utils";
import { EditorManager } from "../Managers";
import { BaseRenderer } from "./BaseRenderer";
import { RenderConfigs } from "../Configs";
import { LabelTypes } from "../Types";
import { IEditor, IPoint, ILine, IRect } from "../Types/Interfaces";
import { RenderUtils, DrawUtils, RectUtils } from "../Utils";
import { LabelsSelector, ImageDataType } from "../Store/Label";
import { store } from "..";
import {
  updateActiveLabelType,
  deactivate_EditMode,
  updateImageDataById,
  updateFirstLabelCreated,
  updateActiveLabelId,
  activateEditMode,
} from "../Store/Label/ActionCreators";
import { EditorActions } from "../Actions";
import { v1 as uuidv1 } from "uuid";
import { LineConfigs } from "../Configs/LineConfigs";
import {
  DoState,
  updateActiveUtilType,
} from "../Store/Editor/ActionCreators";
import { LabelCircle } from "../Store/Label/types";

export class CircleRenderer extends BaseRenderer {
  private configs: RenderConfigs = new RenderConfigs();
  private startPoint: IPoint | null;

  private isInEditMode: boolean = false;
  private editStartPoint: any = null;
  private editEndPoint: any = null;
  private editObject: LabelCircle | null = null;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.labelType = LabelTypes.CIRCLE;
    this.startPoint = null;
    this.isInEditMode = store.getState().labels.isEditMode;
    if (this.isInEditMode && store.getState().labels.inEditLabelId !== null) {
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (imageData !== null) {
        imageData.labelCircles.forEach((labelPoint: LabelCircle) => {
          let kt = store.getState().labels.inEditLabelId;
          if (kt === labelPoint.id) {
            this.editObject = labelPoint;
          }
        });
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
      imageData.labelCircles.forEach((labelcircle: LabelCircle) => {
        if (PointClick !== null) {
          var pt1 = labelcircle.Line.start;
          var pt2 = labelcircle.Line.end;
          let x1x2 = pt1.x - pt2.x;
          let y1y2 = pt1.y - pt2.y;
          var radius = Math.sqrt(x1x2 * x1x2 + y1y2 * y1y2);

          var pointClickRadius = Math.sqrt(
            Math.pow(PointClick.x - pt1.x, 2) +
            Math.pow(PointClick.y - pt1.y, 2)
          );

          if (Math.abs(radius - pointClickRadius) < 10) {
            store.dispatch(updateActiveUtilType(null));
            store.dispatch(updateActiveLabelType(LabelTypes.NONE));
            store.dispatch(activateEditMode(labelcircle.id));
            store.dispatch(updateActiveLabelType(LabelTypes.CIRCLE));
          }
        }
      });
    }
  }

  public keyPressHandler(data: IEditor): void {
    if (data !== undefined) {
      var cht = data.event.key;
      if (this.isInEditMode && cht === "Escape" && this.editObject !== null) {
        store.dispatch(deactivate_EditMode(this.editObject.id));
        store.dispatch(updateActiveLabelType(LabelTypes.NONE));
        store.dispatch(updateActiveLabelType(LabelTypes.CIRCLE));
      }
    }
  }

  // Event Handling
  public mouseMoveHandler(): void {
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
    } else {
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
        else {
          this.startPoint = null;
        }
      }
    }
  }


  public mouseUpHandler(data: IEditor): void {
    if (this.isInEditMode) {
      this.editEndPoint = data.mousePositionOnCanvasContent;
      var edtEnd = RenderUtils.transferPointFromCanvasContentToImage(
        this.editEndPoint,
        data
      );

      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (this.editStartPoint !== null && this.editObject !== null && imageData) {
        var edtStart = RenderUtils.transferPointFromCanvasContentToImage(
          this.editStartPoint,
          data
        );

        if (edtStart !== null && this.editObject !== null) {
          //Logic For MOVE / SCALING Circle

          if (
            Math.abs(this.editObject.Line.start.x - edtStart.x) < 10 &&
            Math.abs(this.editObject.Line.start.y - edtStart.y) < 10
          ) {
            //Case of Center Point Move
            if (edtEnd !== null) {
              var angle = 180;
              angle = angle * (Math.PI / 180);

              this.editObject.Line.end.x =
                edtEnd.x + this.editObject.radius * Math.cos(angle);
              this.editObject.Line.end.y =
                edtEnd.y + this.editObject.radius * Math.sin(angle);
              this.editObject.Line.start = edtEnd;
            }
          }
          var dist = Math.sqrt(Math.pow(edtStart.x - this.editObject.Line.start.x, 2) + Math.pow(edtStart.y - this.editObject.Line.start.y, 2));
          if (Math.abs(dist - this.editObject.radius) < 10) {
            if (edtEnd !== null) {
              var newRadius = Math.sqrt(Math.pow(edtEnd.x - this.editObject.Line.start.x, 2) + Math.pow(edtEnd.y - this.editObject.Line.start.y, 2));
              this.editObject.radius = newRadius;
              this.editObject.Line.end = edtEnd;
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
      else {
        this.startPoint = null;
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
    const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
    if (this.startPoint && isMouseOverImage) {
      const line: ILine = {
        start: this.startPoint,
        end: data.mousePositionOnCanvasContent,
      };

      const imageStart: IPoint = RenderUtils.transferPointFromCanvasContentToImage(this.startPoint, data);
      const imageEnd: IPoint = RenderUtils.transferPointFromCanvasContentToImage(data.mousePositionOnCanvasContent, data);
      DrawUtils.drawCircle(
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

  // get
  // create line
  private startLineCreation = (data: IEditor) => {
    EditorActions.setCanvasActionsDisabledStatus(true);
    this.startPoint = RenderUtils.setPointBetweenPixels(
      data.mousePositionOnCanvasContent
    );
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
        let x1x2 = endPoint.x - startPoint.x;
        let y1y2 = endPoint.y - startPoint.y;
        var rad = Math.sqrt(x1x2 * x1x2 + y1y2 * y1y2);
        const labelLine: LabelCircle = {
          id: uuidv1(),
          labelId: uuidv1(), //activeLabelId,
          isHidden: false,
          Line: { start: startPoint, end: endPoint },
          annotation: null,
          annotationName: "Circle" + imageData.labelCircles.length,
          radius: rad,
        };
        imageData.labelCircles.push(labelLine);
        store.dispatch(DoState(JSON.stringify(imageData)));
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreated(true));
        store.dispatch(updateActiveLabelId(labelLine.id));
        this.startPoint = null;
        EditorActions.setCanvasActionsDisabledStatus(false);
      }
    }
  };
}
