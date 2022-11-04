import { EditorManager } from "../Managers";
import { CanvasUtils } from "../../src/Utils";
import { BaseRenderer } from "./BaseRenderer";
import { IPoint, IEditor, IRect } from "../Types/Interfaces";
import { LabelTypes } from "../Types";
import { RenderUtils, RectUtils, DrawUtils } from "../Utils";
import { LabelRect, LabelsSelector, ImageDataType } from "../Store/Label";
import {
  updateActiveLabelType,
  deactivate_EditMode,
  updateImageDataById,
  updateFirstLabelCreated,
  updateActiveLabelId,
  activateEditMode,
} from "../Store/Label/ActionCreators";
import { store } from "..";
import { RectConfigs } from "../Configs/RectConfigs";
import { v1 as uuidv1 } from "uuid";
import { EditorActions } from "../Actions";
import {
  DoState,
  updateActiveUtilType,
} from "../Store/Editor/ActionCreators";

export class RectRenderer extends BaseRenderer {
  private startPoint: IPoint | null = null;

  private isInEditMode: boolean = false;
  private editStartPoint: any = null;
  private editEndPoint: any = null;
  private editObject: LabelRect | null = null;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.startPoint = null;
    this.labelType = LabelTypes.RECTANGLE;

    this.isInEditMode = store.getState().labels.isEditMode;
    if (this.isInEditMode && store.getState().labels.inEditLabelId !== null) {
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (imageData !== null) {
        imageData.labelRects.forEach((labelrect: LabelRect) => {
          let kt = store.getState().labels.inEditLabelId;
          if (kt === labelrect.id) {
            this.editObject = labelrect;
          }
        });
      }
    }
  }

  // constructor(canvas: HTMLCanvasElement) {
  //   super(canvas);
  //   this.labelType = LabelTypes.RECTANGLE;
  // }

  // Event handling
  public keyPressHandler(data: IEditor): void {
    if (data !== undefined) {
      var cht = data.event.key;
      if (this.isInEditMode && cht === "Escape" && this.editObject !== null) {
        store.dispatch(deactivate_EditMode(this.editObject.id));
        store.dispatch(updateActiveLabelType(LabelTypes.NONE));
        store.dispatch(updateActiveLabelType(LabelTypes.RECTANGLE));
      }
      else if (cht === "Escape"){
        this.startPoint = null;
      }
    }
  }

  public checkPointLiesOnLine(pointA: IPoint, pointB: IPoint, pointC: IPoint) {
    //  A.------------.C-------------.B
    var distAB = Math.sqrt(
      Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
    );
    var distAC = Math.sqrt(
      Math.pow(pointA.x - pointC.x, 2) + Math.pow(pointA.y - pointC.y, 2)
    );
    var distCB = Math.sqrt(
      Math.pow(pointC.x - pointB.x, 2) + Math.pow(pointC.y - pointB.y, 2)
    );

    if (distAB - 10 < distAC + distCB && distAC + distCB < distAB + 10) {
      return true;
    }
    return false;
  }

  public checkEditUpdate(lablerect: LabelRect) {
    store.dispatch(updateActiveUtilType(null));
    store.dispatch(updateActiveLabelType(LabelTypes.NONE));
    store.dispatch(activateEditMode(lablerect.id));
    store.dispatch(updateActiveLabelType(LabelTypes.RECTANGLE));
  }

  public CheckEdit(data: any, mousePosition: any) {
    var PointClick: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(
      mousePosition,
      data
    );
    const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
    if (imageData !== null && PointClick !== null) {
      imageData.labelRects.forEach((lablerect: LabelRect) => {
        if (PointClick !== null) {
          /*

              A.---------------.B
               |               |
               |               |
               |               |
              D.---------------.C


          */
          let ptA: IPoint = { x: lablerect.Rect.x, y: lablerect.Rect.y };
          let ptB: IPoint = {
            x: lablerect.Rect.x + lablerect.Rect.width,
            y: lablerect.Rect.y,
          };
          let ptC: IPoint = {
            x: lablerect.Rect.x + lablerect.Rect.width,
            y: lablerect.Rect.y + lablerect.Rect.height,
          };
          let ptD: IPoint = {
            x: lablerect.Rect.x,
            y: lablerect.Rect.y + lablerect.Rect.height,
          };

          if (this.checkPointLiesOnLine(ptA, ptB, PointClick)) {
            return this.checkEditUpdate(lablerect); //return true;
          }
          if (this.checkPointLiesOnLine(ptB, ptC, PointClick)) {
            return this.checkEditUpdate(lablerect); // return true;
          }
          if (this.checkPointLiesOnLine(ptC, ptD, PointClick)) {
            return this.checkEditUpdate(lablerect); //return true;
          }
          if (this.checkPointLiesOnLine(ptD, ptA, PointClick)) {
            return this.checkEditUpdate(lablerect); //return true;
          }
        }
      });
    }
  }
  public mouseMoveHandler(_data: IEditor): void { }

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
        if (isMouseOverCanvas && isMouseOverImage ) {
          const isInProgress:boolean = this.isInProgress();
          if (!isInProgress){
            this.startPoint = data.mousePositionOnCanvasContent;
            EditorActions.setCanvasActionsDisabledStatus(true);
          }
          else{

              const endPoint: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(
                data.mousePositionOnCanvasContent,
                data
              );
              if (this.startPoint) {
                const startPt = RenderUtils.transferPointFromCanvasContentToImage(
                  this.startPoint,
                  data
                );
                if (endPoint && startPt) {
                  const rect = {
                    x: Math.min(startPt.x, endPoint.x),
                    y: Math.min(startPt.y, endPoint.y),
                    width:
                      Math.max(startPt.x, endPoint.x) -
                      Math.min(startPt.x, endPoint.x),
                    height:
                      Math.max(startPt.y, endPoint.y) -
                      Math.min(startPt.y, endPoint.y),
                  };

                  if (rect) {
                    this.addRectLabel(rect);
                  }
                }
              }
              this.startPoint = null;
              EditorActions.setCanvasActionsDisabledStatus(false);
          }
        }
        }
      }
    }


  public checkPointIsEdited(point: IPoint, newPoint: IPoint) {

    if (
      Math.abs(point.x - newPoint.x) < 10 &&
      Math.abs(point.y - newPoint.y) < 10 &&
      this.editObject !== null
    ) {
      return true;
    }

    return false;
  }

  public mouseUpHandler(data: IEditor): void {
    if (this.isInEditMode) {
      //alert('adsf');
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();

      this.editEndPoint = data.mousePositionOnCanvasContent;

      var edtEnd = RenderUtils.transferPointFromCanvasContentToImage(
        this.editEndPoint,
        data
      );

      if (
        edtEnd !== null &&
        this.editStartPoint !== null &&
        this.editObject !== null &&
        imageData
      ) {
        var edtStart = RenderUtils.transferPointFromCanvasContentToImage(
          this.editStartPoint,
          data
        );
        if (edtStart !== null && this.editObject !== null) {
          var ptA = { x: this.editObject.Rect.x, y: this.editObject.Rect.y };
          var ptB = { x: this.editObject.Rect.x + this.editObject.Rect.width, y: this.editObject.Rect.y };
          var ptC = { x: this.editObject.Rect.x + this.editObject.Rect.width, y: this.editObject.Rect.y + this.editObject.Rect.height };
          var ptD = { x: this.editObject.Rect.x, y: this.editObject.Rect.y + this.editObject.Rect.height };


          if (this.checkPointIsEdited(ptA, edtStart)) {
            var maxWidth = this.editObject.Rect.x + this.editObject.Rect.width;
            var maxHeight = this.editObject.Rect.y + this.editObject.Rect.height;
            if (edtEnd.x < maxWidth && edtEnd.y < maxHeight) {
              this.editObject.Rect.x = edtEnd.x;
              this.editObject.Rect.y = edtEnd.y;
              this.editObject.Rect.width = this.editObject.Rect.width + (edtStart.x - edtEnd.x);
              this.editObject.Rect.height = this.editObject.Rect.height + (edtStart.y - edtEnd.y);
            }
          }

          if (this.checkPointIsEdited(ptB, edtStart)) {
          }
          if (this.checkPointIsEdited(ptC, edtStart)) {
            if (this.editObject.Rect.width + (edtEnd.x - edtStart.x) > 0 && this.editObject.Rect.height + (edtEnd.y - edtStart.y) > 0) {
              this.editObject.Rect.width = this.editObject.Rect.width + (edtEnd.x - edtStart.x);
              this.editObject.Rect.height = this.editObject.Rect.height + (edtEnd.y - edtStart.y);
            }
          }
          if (this.checkPointIsEdited(ptD, edtStart)) {
          }
        }
      }
    } else {

    }
  }

  public render(data: IEditor): void {

    const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
    const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
    if (isMouseOverImage && isMouseOverCanvas && data.canvasContentImageRect) {
      this.drawCurrentlyCreatedRect(
        data.mousePositionOnCanvasContent,
        data.canvasContentImageRect,
        data
      );
    }
  }

  public isInProgress(): boolean {
    return !!this.startPoint;
  }

  //helper

  private addRectLabel = (rect: IRect) => {
    const activeLabelId = LabelsSelector.getActiveLabelId();
    const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
    if (activeLabelId && imageData) {
      const labelRect: LabelRect = {
        isHidden: false,
        id: uuidv1(),
        labelId: uuidv1(), //activeLabelId,
        Rect: rect,
        annotation: null,
        annotationName: "Rect" + imageData.labelRects.length,
      };

      imageData.labelRects.push(labelRect);
      store.dispatch(DoState(JSON.stringify(imageData)));
      store.dispatch(updateActiveLabelId(labelRect.id));
      store.dispatch(updateImageDataById(imageData.id, imageData));
      store.dispatch(updateFirstLabelCreated(true));
    }
  };

  private drawCurrentlyCreatedRect(mousePosition: IPoint, imageRect: IRect, data: IEditor) {
    if (!!this.startPoint) {
      const mousePositionSnapped: IPoint = RectUtils.keepPointWithinRect(
        mousePosition,
      );
      const activeRect: IRect = {
        x: this.startPoint.x,
        y: this.startPoint.y,
        width: mousePositionSnapped.x - this.startPoint.x,
        height: mousePositionSnapped.y - this.startPoint.y,
      };
      const activeRectBetweenPixels = RenderUtils.setRectBetweenPixels(
        activeRect
      );


      const imageStart: IPoint = RenderUtils.transferPointFromCanvasContentToImage(this.startPoint, data);
      const imageEnd: IPoint = RenderUtils.transferPointFromCanvasContentToImage(mousePositionSnapped, data);

      const imageRect: IRect = {
        x: imageStart.x,
        y: imageStart.y,
        width: imageEnd.x - imageStart.x,
        height: imageEnd.y - imageStart.y,
      };
      DrawUtils.drawRect(
        this.canvas,
        activeRectBetweenPixels,
        imageRect,
        RectConfigs.RECT_ACTIVE_COLOR,
        RectConfigs.RECT_THICKNESS
      );
    }
  }
}
