import { CanvasUtils } from "../../src/Utils";
import { LabelTypes } from "../Types";
import { BaseRenderer } from "./BaseRenderer";
import { IEditor, IPoint } from "../Types/Interfaces";
import { EditorManager } from "../Managers";
import { RenderUtils, DrawUtils } from "../Utils";
import { ImageDataType, LabelsSelector, LabelPoint } from "../Store/Label";
import { store } from "..";
import {
  updateActiveLabelType,
  deactivate_EditMode,
  updateImageDataById,
  updateFirstLabelCreated,
  updateActiveLabelId,
  activateEditMode,
} from "../Store/Label/ActionCreators";
import { v1 as uuidv1 } from "uuid";
import { PointConfigs } from "../Configs/PointConfigs";
import {
  DoState,
  updateActiveUtilType,
} from "../Store/Editor/ActionCreators";

export class PointRenderer extends BaseRenderer {

  private isInEditMode: boolean = false;
  private editStartPoint: any = null;
  private editEndPoint: any = null;
  private editObject: LabelPoint | null = null;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.labelType = LabelTypes.POINT;
    this.isInEditMode = store.getState().labels.isEditMode;
    //alert(this.isInEditMode)
    if (this.isInEditMode && store.getState().labels.inEditLabelId !== null) {
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (imageData !== null) {
        imageData.labelPoints.forEach((labelPoint: LabelPoint) => {
          let kt = store.getState().labels.inEditLabelId;
          if (kt === labelPoint.id) {
            this.editObject = labelPoint;
            //break;
          }
        });
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
        store.dispatch(updateActiveLabelType(LabelTypes.POINT));
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
      imageData.labelPoints.forEach((labelPoint: LabelPoint) => {


        // var P1: any = labelLine.Line.start;
        // var P2: any = labelLine.Line.end;
        // var distOfLine = Math.sqrt(
        //   Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2)
        // );
        // P1 = labelLine.Line.start;
        // P2 = PointClick;
        // var distAC = Math.sqrt(
        //   Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2)
        // );
        // P1 = labelLine.Line.end;
        // var distCB = Math.sqrt(
        //   Math.pow(P1.x - P2.x, 2) + Math.pow(P1.y - P2.y, 2)
        // );
        // if (
        //   distOfLine - 10 < distAC + distCB &&
        //   distAC + distCB < distOfLine + 10
        // )
        if (PointClick !== null && Math.abs(PointClick.x - labelPoint.Point.x) < 10 && Math.abs(PointClick.y - labelPoint.Point.y) < 10) {
          //   alert('Triggering edit')
          store.dispatch(updateActiveUtilType(null));
          store.dispatch(updateActiveLabelType(LabelTypes.NONE));
          store.dispatch(activateEditMode(labelPoint.id));
          store.dispatch(updateActiveLabelType(LabelTypes.POINT));
          //return;
        }
      });
    }
  }



  public mouseMoveHandler(_data: IEditor): void {
    // no need for creation
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

        if (isMouseOverCanvas && isMouseOverImage) {
          const pointOnImage: IPoint | null = RenderUtils.transferPointFromCanvasContentToImage(
            data.mousePositionOnCanvasContent,
            data
          );
          if (pointOnImage) {
            this.addNewPointLabel(pointOnImage);
          }
        }
      }

    }
  }
  public mouseUpHandler(data: IEditor): void {
    if (this.isInEditMode) {
      //alert('mouseUp handler')
      this.editEndPoint = data.mousePositionOnCanvasContent;
      const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
      if (this.editStartPoint !== null && this.editObject !== null && imageData) {

        //alert(JSON.stringify(this.editObject))
        var ed = RenderUtils.transferPointFromCanvasContentToImage(
          this.editStartPoint,
          data
          );

          if (ed !== null && this.editObject !== null) {
            if (
              Math.abs(this.editObject.Point.x - ed.x) < 10 &&
              Math.abs(this.editObject.Point.y - ed.y) < 10 &&
            this.editObject !== null
            ) {
              var cht = RenderUtils.transferPointFromCanvasContentToImage(
                this.editEndPoint,
                data
                );
                if (cht !== null) {
                  this.editObject.Point = cht;
                  store.dispatch(updateImageDataById(imageData.id, imageData));
                }
              }
            }
          }
        }
  }

  //  Rendering
  public render(data: IEditor): void {
    let activeLabelId: string | null = LabelsSelector.getActiveLabelId();
    let highlightedLabelId:
      | string
      | null = LabelsSelector.getHighlightedLabelId();
    let imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
    if (imageData) {
      imageData.labelPoints.forEach((labelPoint: LabelPoint) => {
        if (
          labelPoint.id === activeLabelId ||
          labelPoint.id === highlightedLabelId
        ) {
          const pointOnImage: IPoint | null = RenderUtils.transferPointFromImageToCanvasContent(
            labelPoint.Point,
            data
          );
          if (pointOnImage) {
            const standardizedPoint = RenderUtils.setPointBetweenPixels(
              pointOnImage
            );

            if (this.isInEditMode && this.editObject !== null &&
              store.getState().labels.inEditLabelId !== null
              && this.editObject.id === labelPoint.id
            ) {
              DrawUtils.drawDot(
                this.canvas,
                standardizedPoint,
                "red",
                //PointConfigs.POINT_ACTIVE_COLOR,
                PointConfigs.POINT_THICKNESS
              );
            }
            else {
              DrawUtils.drawDot(
                this.canvas,
                standardizedPoint,
                PointConfigs.POINT_ACTIVE_COLOR,
                PointConfigs.POINT_THICKNESS
              );



            }


          }
        }
      });
    }
  }

  isInProgress(): boolean {
    return false;
  }

  //helpers
  private addNewPointLabel = (point: IPoint): void => {
    const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
    const activeImageData: ImageDataType | null = LabelsSelector.getActiveImageData();
    if (activeImageData && activeLabelId) {
      const newLabelPoint: LabelPoint = {
        isHidden: false,
        id: uuidv1(),
        labelId: uuidv1(),//activeLabelId,
        Point: point,
        annotation: null,
        annotationName: "Point" + activeImageData.labelPoints.length,
      };
      activeImageData.labelPoints.push(newLabelPoint);
      store.dispatch(DoState(JSON.stringify(activeImageData)));
      store.dispatch(updateImageDataById(activeImageData.id, activeImageData));
      store.dispatch(updateActiveLabelId(newLabelPoint.id));
      if (!LabelsSelector.getFirstActiveLabel()) {
        store.dispatch(updateFirstLabelCreated(true));
      }
    }
  };
}
