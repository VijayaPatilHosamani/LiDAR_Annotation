/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPoint, IEditor } from "../Types/Interfaces";
import { EditorManager } from "../Managers";
import {
  DrawUtils,
  LineUtils,
  CircleUtils,
  PointUtils,
  RectUtils,
  PolygonUtils,
  ArrowUtils,
  CuboidUtils,
  FreehandUtils,
  SegmentationUtils,
} from "../Utils";
import { BaseRenderer } from "./BaseRenderer";
import { RenderConfigs } from "../Configs";
import { RenderUtils } from "../Utils/RenderUtils";
import { EditorSelector } from "../Store/Editor";
import { CanvasActions } from "../Actions/CanvasActions";
import { PaintBrushUtils } from "../Utils/PaintBrushUtils";

export class DefaultRenderer extends BaseRenderer {
  private configs: RenderConfigs = new RenderConfigs();

  private isFirst = 0;
  public constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  public keyPressHandler(_data: IEditor): void {

  }

  // Event Handling
  public mouseMoveHandler(_data: IEditor): void { }
  public mouseDownHandler(_data: IEditor): void { }
  public mouseUpHandler(_data: IEditor): void { }

  //  Rendering
  public render(data: IEditor): void {
    let grayScale = EditorSelector.getGrayscale();
    let blur = EditorSelector.getBlur();
    let sharpen = EditorSelector.getSharpen();
    let contrast = EditorSelector.getContrast();
    let brightness = EditorSelector.getBrightness();

    if (this.isFirst === 0) {
      if (EditorManager.image) {
        let widthRatio = this.canvas.width / EditorManager.image.width;
        let wR = Math.max(widthRatio);
        let heightRatio = this.canvas.height / EditorManager.image.height;
        let hR = Math.max(heightRatio);
        let ratioFinal: any = Math.max(hR, wR);
        ratioFinal = ratioFinal.toFixed(1);
        if (ratioFinal < 1) {
          CanvasActions.setZoom(1 - ratioFinal);
          //alert(ratioFinal);
        }
        this.isFirst = 1;
      }
    }

    if (EditorManager.image && EditorSelector.getZoom() === 1) {
      this.canvas.width = EditorManager.image.width;
      this.canvas.height = EditorManager.image.height;
    } else {
      if (EditorManager.image) {
        this.canvas.width =
          EditorManager.image.width * EditorSelector.getZoom();
        //(EditorManager.image.width * (EditorSelector.getZoom() / 2))
        this.canvas.height =
          EditorManager.image.height * EditorSelector.getZoom();
        //((EditorManager.image.height * EditorSelector.getZoom()) / 2);
      }
    }

    DrawUtils.drawImage(
      this.canvas,
      EditorManager.image,
      CanvasActions.calculateCanvasContentImageRect()
    );
    DrawUtils.appyEffects(
      this.canvas,
      EditorManager.image,
      CanvasActions.calculateCanvasContentImageRect(),
      {
        grayScale: grayScale,
        blur: blur,
        sharpen: sharpen,
        contrast: contrast,
        brightness: brightness,
      }
    );

    if (!EditorSelector.getHideStatus()) {
      PointUtils.drawExistingPoints(this.canvas, data);
      LineUtils.drawExistingLines(this.canvas, data);
      RectUtils.drawExistingRectangles(this.canvas, data);
      CircleUtils.drawExistingCircles(this.canvas, data);
      PolygonUtils.drawExistingPolygon(this.canvas, data);
      SegmentationUtils.drawExistingSegmentation(this.canvas, data);
      ArrowUtils.drawExistingArrow(this.canvas, data);
      CuboidUtils.drawExistingCuboid(this.canvas, data);
      FreehandUtils.drawExistingFreehand(this.canvas, data);
      PaintBrushUtils.drawExistingPaintBrush(this.canvas, data);
    }

    this.renderCursor(data);
  }

  public renderCursor(data: IEditor): void {
    const drawLine = (startPoint: IPoint, endPoint: IPoint) => {
      DrawUtils.drawCrossHair(
        this.canvas,
        startPoint,
        endPoint,
        this.configs.crossHairLineColor,
        1
      );
    };

    const crossHairVisible = true; //EditorSelector.getCrossHairVisibleStatus();
    const imageDragMode = EditorSelector.getImageDragModeStatus();

    if (!this.canvas || !crossHairVisible || imageDragMode) return;

    const isMouseOverCanvas: boolean | null = RenderUtils.isMouseOverCanvas(
      data
    );
    if (isMouseOverCanvas && data.canvasContentSize) {
      const mouse = RenderUtils.setPointBetweenPixels(
        data.mousePositionOnCanvasContent
      );
      drawLine(
        { x: mouse.x, y: 0 },
        { x: mouse.x - 1, y: mouse.y - this.configs.crossHairPadding }
      );
      drawLine(
        { x: mouse.x, y: mouse.y + this.configs.crossHairPadding },
        { x: mouse.x - 1, y: data.canvasContentSize.height }
      );
      drawLine(
        { x: 0, y: mouse.y },
        { x: mouse.x - this.configs.crossHairPadding, y: mouse.y - 1 }
      );
      drawLine(
        { x: mouse.x + this.configs.crossHairPadding, y: mouse.y },
        { x: data.canvasContentSize.width, y: mouse.y - 1 }
      );
    }
  }

  isInProgress(): boolean {
    return false;
  }
}
