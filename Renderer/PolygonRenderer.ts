
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
import { LabelPolygon } from "../Store/Label/types";
import {
  DoState,
  updateActiveUtilType,
} from "../Store/Editor/ActionCreators";

export class PolygonRenderer extends BaseRenderer {
  private configs: RenderConfigs = new RenderConfigs();
  private startPoint: IPoint | null;

  private isInEditMode: boolean = false;
  private editStartPoint: any = null;
  private editEndPoint: any = null;
  private editObject: LabelPolygon | null = null;


  // public constructor(canvas: HTMLCanvasElement) {
  //   super(canvas);
  //   this.labelType = LabelTypes.POLYGON;
  //   this.startPoint = null;
  // }

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.labelType = LabelTypes.POINT;
    this.startPoint = null;
    this.isInEditMode = store.getState().labels.isEditMode;
    if (this.isInEditMode && store.getState().labels.inEditLabelId !== null) {
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (imageData !== null) {
        imageData.labelPolygon.forEach((labelPolygon: LabelPolygon) => {
          let kt = store.getState().labels.inEditLabelId;
          if (kt === labelPolygon.id) {
            this.editObject = labelPolygon;
            //break;
          }
        });
      }
    }
  }



  arr: any = [];
  // Event Handling
  // Event handling
  public keyPressHandler(data: IEditor): void {
    if (data !== undefined) {
      var cht = data.event.key;
      if (this.isInEditMode && cht === "Escape" && this.editObject !== null) {
        store.dispatch(deactivate_EditMode(this.editObject.id));
        store.dispatch(updateActiveLabelType(LabelTypes.NONE));
        store.dispatch(updateActiveLabelType(LabelTypes.POLYGON));
      }
      else if(cht === "Enter"){
        this.endLineCreation(data);
      }
      else if(cht === "Escape"){
        this.startPoint = null;
        this.arr = [];
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

      imageData.labelPolygon.forEach((labelPolygon: LabelPolygon) => {
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
            store.dispatch(updateActiveLabelType(LabelTypes.POLYGON));
            //return;
          }
        });


      })

    }
  }


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
        //alert('moving in edit')
        this.editStartPoint = RenderUtils.setPointBetweenPixels(
          data.mousePositionOnCanvasContent
        );
      } else {
        const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
        const inprogress = this.isInProgress()
        if (isMouseOverImage && isMouseOverCanvas) {
          if (!inprogress){
            this.startLineCreation(data);
          }
          else{
            this.addLineCreation(data);
          }
        }

      }
    }
  }

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
                var check = RenderUtils.transferPointFromCanvasContentToImage(
                  this.editEndPoint,
                  data
                );
                if (check !== null) {
                  line.Line.end = check;
                  store.dispatch(updateImageDataById(imageData.id, imageData));
                }
              }


            }


          })
          // if (
          //   Math.abs(this.editObject.Line.start.x - ed.x) < 10 &&
          //   Math.abs(this.editObject.Line.start.y - ed.y) < 10 &&
          //   this.editObject !== null
          // ) {
          //   var cht = RenderUtils.transferPointFromCanvasContentToImage(
          //     this.editEndPoint,
          //     data
          //   );
          //   if (cht !== null) {
          //     this.editObject.Line.start = cht;
          //     store.dispatch(updateImageDataById(imageData.id, imageData));
          //   }
          // }
          // if (
          //   Math.abs(this.editObject.Line.end.x - ed.x) < 10 &&
          //   Math.abs(this.editObject.Line.end.y - ed.y) < 10 &&
          //   this.editObject !== null
          // ) {
          //   var cht = RenderUtils.transferPointFromCanvasContentToImage(
          //     this.editEndPoint,
          //     data
          //   );
          //   if (cht !== null) {
          //     this.editObject.Line.end = cht;
          //     store.dispatch(updateImageDataById(imageData.id, imageData));
          //   }
          // }
        }
      }
    } else {
      // const isMouseOverImage: boolean = RenderUtils.isMouseOverImage(data);
      // const isMouseOverCanvas: boolean = RenderUtils.isMouseOverCanvas(data);
      // const inprogress = this.isInProgress()
      // if (isMouseOverImage && isMouseOverCanvas && !inprogress) {
      //   this.addLineCreation(data);
      // }
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


      if(this.arr.length > 1) {
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
        this.startPoint = endPoint;
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
        const labelPolygon: LabelPolygon = {
          isHidden: false,
          id: uuidv1(),
          labelId: uuidv1(),//activeLabelId,
          Lines: this.arr,
          annotation: null,
          annotationName: 'Polygon' + imageData.labelPolygon.length
        };
        imageData.labelPolygon.push(labelPolygon);
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
