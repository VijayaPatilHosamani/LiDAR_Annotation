import { EditorManager } from "../../src/Managers";
import { CanvasUtils } from "../../src/Utils";
import { BaseRenderer } from "./BaseRenderer";
import { RenderConfigs } from "../Configs";
import { LabelTypes } from "../Types";
import { IEditor, ILine, IRect, IPoint } from "../Types/Interfaces";
import { RenderUtils, DrawUtils, RectUtils } from "../Utils";
import { LabelLine, LabelsSelector, ImageDataType } from "../Store/Label";
import { store } from "..";
import {
  updateActiveLabelType,
  deactivate_EditMode,
  updateImageDataById,
  updateFirstLabelCreated,
  updateActiveLabelId,
  activateEditMode,
} from "../Store/Label/ActionCreators";

import {
  DoState,
  updateActiveUtilType,
} from "../Store/Editor/ActionCreators";

import { EditorActions } from "../Actions";
import { v1 as uuidv1 } from "uuid";
import { LineConfigs } from "../Configs/LineConfigs";
import { LabelArrow } from "../Store/Label/types";

export class ArrowRenderer extends BaseRenderer {
  private configs: RenderConfigs = new RenderConfigs();
  private startPoint: IPoint | null;

  // public constructor(canvas: HTMLCanvasElement) {
  //   super(canvas);
  //   this.labelType = LabelTypes.ARROW;
  //   this.startPoint = null;
  // }

  private isInEditMode: boolean = false;
  private editStartPoint: any = null;
  private editEndPoint: any = null;
  private editObject: LabelArrow | null = null;


  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.labelType = LabelTypes.ARROW;
    this.startPoint = null;
    this.isInEditMode = store.getState().labels.isEditMode;
    //alert(this.isInEditMode)
    if (this.isInEditMode && store.getState().labels.inEditLabelId !== null) {
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (imageData !== null) {
        imageData.labelArrow.forEach((labelArrowItem: LabelArrow) => {
          let kt = store.getState().labels.inEditLabelId;
          if (kt === labelArrowItem.id) {
            this.editObject = labelArrowItem;
            //break;
          }
        });
      }
    }
  }

  arr: any = [];
  // Event Handling
  public mouseMoveHandler(_data: IEditor): void {
    // handled by draw active line creation
  }
  // public mouseDownHandler(data: IEditor): void {
  //   const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
  //   if (isMouseOverImage) {
  //     if (!this.isInProgress()) {
  //       this.startLineCreation(data);
  //     }
  //   }
  // }

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
        //alert('moving in edit')
        this.editStartPoint = RenderUtils.setPointBetweenPixels(
          data.mousePositionOnCanvasContent
        );
      } else {
        const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
        const isInProgress = this.isInProgress();
        if (isMouseOverImage && isMouseOverCanvas && !isInProgress) {
            this.startLineCreation(data);
        }
        else{
          this.startPoint = null;
        }
      }
    }

  }


  // public mouseUpHandler(data: IEditor): void {
  //   const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
  //   if (isMouseOverImage && this.isInProgress()) {
  //     this.endLineCreation(data);
  //   }
  // }

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
          this.editObject.Lines.forEach((line: any) => {
            if (line !== null && ed !== null && this.editObject !== null) {

              if (
                Math.abs(line.Line.start.x - ed.x) < 10 &&
                Math.abs(line.Line.start.y - ed.y) < 10 &&
                this.editObject !== null
              ) {
                var cht = RenderUtils.transferPointFromCanvasContentToImage(
                  this.editEndPoint,
                  data
                );
                if (cht !== null) {
                  line.Line.start = cht;
                  store.dispatch(updateImageDataById(imageData.id, imageData));
                }
              }
              if (
                Math.abs(line.Line.end.x - ed.x) < 10 &&
                Math.abs(line.Line.end.y - ed.y) < 10 &&
                this.editObject !== null
              ) {
                var cht2 = RenderUtils.transferPointFromCanvasContentToImage(
                  this.editEndPoint,
                  data
                );
                if (cht2 !== null) {
                  line.Line.end = cht2;
                  store.dispatch(updateImageDataById(imageData.id, imageData));
                }
              }
            }
          })
        }
      }
    } else {
      const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
      const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
      const isInProgress = this.isInProgress();
      if (isMouseOverImage && isMouseOverCanvas && isInProgress) {
        this.endLineCreation(data);
      }
      else {
        this.startPoint = null;
      }
    }
  }


  // Event handling
  public keyPressHandler(data: IEditor): void {
    if (data !== undefined) {
      var cht = data.event.key;
      if (this.isInEditMode && cht === "Escape" && this.editObject !== null) {
        store.dispatch(deactivate_EditMode(this.editObject.id));
        store.dispatch(updateActiveLabelType(LabelTypes.NONE));
        store.dispatch(updateActiveLabelType(LabelTypes.ARROW));
      }
    }
  }


  //Rendering
  public render(data: IEditor): void {
    this.drawActivelyCreatedLines(data);
  }


  public CheckEdit(data: any, mousePosition: any) {
    var PointClick: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(
      mousePosition,
      data
    );
    const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();

    if (imageData !== null && PointClick !== null) {

      imageData.labelArrow.forEach((labelPolygon: LabelArrow) => {
        labelPolygon.Lines.forEach((labelLine: any) => {
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
            store.dispatch(activateEditMode(labelPolygon.id));
            store.dispatch(updateActiveLabelType(LabelTypes.ARROW));
            //return;
          }
        });
      })
    }
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
      DrawUtils.drawLineArrow(
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
        //   let arr: any = [];
        const horizontalLine: LabelLine = {
          id: uuidv1(),
          labelId: activeLabelId,
          Line: { start: startPoint, end: endPoint },
          isHidden: false,
          annotation: null,
          annotationName: undefined
        };
        this.arr.push(horizontalLine);

        //start
        let fromX = startPoint.x;
        let fromY = startPoint.y;

        let tox = endPoint.x;
        let toy = endPoint.y;

        var x_center = tox;
        var y_center = toy;

        var r = Math.sqrt(Math.pow(tox - fromX, 2) + Math.pow(toy - fromY, 2));
        r -= 0.75 * r;
        var angle;
        var x;
        var y;
        angle = Math.atan2(toy - fromY, tox - fromX);

        //end


        //upper lip
        var uAngle = angle - (1 / 3) * (2 * Math.PI);
        x = r * Math.cos(uAngle) + x_center;
        y = r * Math.sin(uAngle) + y_center;
        let upEnd: IPoint = {
          x: x,
          y: y,
        };
        const arrowUpperHead: LabelLine = {
          id: "upper" + uuidv1(),
          labelId: activeLabelId,
          Line: { start: endPoint, end: upEnd },
          isHidden: false,
          annotation: null,
          annotationName: undefined
        };
        this.arr.push(arrowUpperHead);



        //lower lip
        var lAngle = angle + (1 / 3) * (2 * Math.PI);
        x = r * Math.cos(lAngle) + x_center;
        y = r * Math.sin(lAngle) + y_center;
        let downEnd: IPoint = {
          x: x,
          y: y,
        };
        const arrowLowerHead: LabelLine = {
          id: "lower" + uuidv1(),
          labelId: activeLabelId,
          Line: { start: endPoint, end: downEnd },
          isHidden: false,
          annotation: null,
          annotationName: undefined
        };
        this.arr.push(arrowLowerHead);


        //add to image data
        const labelArrow: LabelArrow = {
          id: uuidv1(),
          labelId: activeLabelId,
          Lines: this.arr,
          isHidden: false,
          annotation: null,
          annotationName: 'Arrow' + imageData.labelArrow.length
        };
        this.arr = [];
        imageData.labelArrow.push(labelArrow);
        store.dispatch(DoState(JSON.stringify(imageData)));
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreated(true));
        store.dispatch(updateActiveLabelId(labelArrow.id));
        this.startPoint = null;
        EditorActions.setCanvasActionsDisabledStatus(false);
      }
    }

    //polygon renderer
    // this.startPoint = endPoint;
    //this.startLineCreation(data);
    // if (this.arr.length > 1) {
    //   let st = startPoint,
    //     ed = endPoint;
    //   let x = this.arr[0];
    //   let originX = x.Line.start.x;
    //   let originY = x.Line.start.y;

    //   let targetX = ed.x;
    //   let targetY = ed.y;

    //   if (
    //     Math.abs(targetX - originX) < 10 &&
    //     Math.abs(targetY - originY) < 10
    //   ) {
    //     this.startPoint = null;
    //     const labelArrow: LabelArrow = {
    //       id: uuidv1(),
    //       labelId: activeLabelId,
    //       Lines: this.arr,
    //     };
    //     imageData.labelArrow.push(labelArrow);
    //     imageData.labelLines = [];
    //     store.dispatch(updateImageDataById(imageData.id, imageData));
    //     store.dispatch(updateFirstLabelCreated(true));
    //     store.dispatch(updateActiveLabelId(labelArrow.id));
    //     this.arr = [];
    //   }
    //   EditorActions.setCanvasActionsDisabledStatus(false);
    // }
  };
}
//   };
// }
