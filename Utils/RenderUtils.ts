import { IPoint, IRect, IEditor } from "../Types/Interfaces";
import { RectUtils } from "./RectUtils";
import { ILine } from "../Types/Interfaces";
import { LineUtils } from "./LineUtils";
import { EditorManager } from "../Managers";
import { EditorSelector } from "../Store/Editor";

export class RenderUtils {
  public static calculateImageScale(data: IEditor): number | null {
    if (data.realImageSize && data.canvasContentImageRect) {
      return data.realImageSize.width / data.canvasContentImageRect.width;
    } else {
      return null;
    }
  }

  public static isMouseOverCanvas(data: IEditor): boolean {
    if (data.canvasContentSize && data.canvasContentSize) {
      let canvasRect: IRect = {
        x: 0,
        y: 0,
        width: data.canvasContentSize.width,
        height: data.canvasContentSize.height,
      };
      let mousePosition: IPoint = data.mousePositionOnCanvasContent;

      return RectUtils.isPointInside(canvasRect, mousePosition) || false;
    }
    return false;
  }

  public static isMouseOverImage(data: IEditor): boolean {
    return true;
    // if (data.canvasContentImageRect && data.mousePositionOnCanvasContent) {
    //   return (
    //     RectUtils.isPointInside(
    //       data.canvasContentImageRect,
    //       data.mousePositionOnCanvasContent
    //     ) || false
    //   );
    // }
    // return false;
  }

  public static isMouseOverLine(
    mouse: IPoint,
    line: ILine,
    radius: number
  ): boolean {
    const minX: number = Math.min(line.start.x, line.end.x);
    const maxX: number = Math.max(line.start.x, line.end.x);
    const minY: number = Math.min(line.start.y, line.end.y);
    const maxY: number = Math.max(line.start.y, line.end.y);

    const lineDistance: number | null = LineUtils.getDistanceFromLine(
      line,
      mouse
    );
    if (lineDistance) {
      return (
        minX - radius <= mouse.x &&
        maxX + radius >= mouse.x &&
        minY - radius <= mouse.y &&
        maxY + radius >= mouse.y &&
        lineDistance < radius
      );
    }
    return false;
  }

  public static setValueBetweenPixels(value: number): number {
    return value;
  }

  public static setPointBetweenPixels(point: IPoint): IPoint {
    return {
      x: RenderUtils.setValueBetweenPixels(point.x),
      y: RenderUtils.setValueBetweenPixels(point.y),
    };
  }

  public static setRectBetweenPixels(rect: IRect): IRect {
    const topLeft: IPoint = {
      x: rect.x,
      y: rect.y,
    };
    const bottomRight: IPoint = {
      x: rect.x + rect.width,
      y: rect.y + rect.height,
    };
    const topLeftBetweenPixels = RenderUtils.setPointBetweenPixels(topLeft);
    const bottomRightBetweenPixels = RenderUtils.setPointBetweenPixels(
      bottomRight
    );
    return {
      x: topLeftBetweenPixels.x,
      y: topLeftBetweenPixels.y,
      width: bottomRightBetweenPixels.x - topLeftBetweenPixels.x,
      height: bottomRightBetweenPixels.y - topLeftBetweenPixels.y,
    };
  }

  public static transferPointFromImageToCanvasContent(
    point: IPoint,
    data: IEditor
  ): IPoint | null {
    // const scale = RenderUtils.calculateImageScale(data);
    // if (scale && data.canvasContentImageRect) {
    //     return PointUtils.add(PointUtils.multiply(point, 1 / scale), data.canvasContentImageRect);
    // }
    // return null;
    if (
      EditorManager.image &&
      EditorManager.canvas &&
      EditorSelector.getZoom() !== 1
      ) {
        let xScale = point.x * (EditorSelector.getZoom() - 1);
        let yScale = point.y * (EditorSelector.getZoom() - 1);
        let retPoint: IPoint = { x: point.x + xScale, y: point.y + yScale };
        return retPoint;
      }
    return point;
  }

  public static transferPointFromCanvasContentToImage(
    point: IPoint,
    data: IEditor
  ): IPoint | null {
    // const scale = RenderUtils.calculateImageScale(data);
    // if (scale && data.canvasContentImageRect) {
    //     return PointUtils.multiply(PointUtils.subtract(point, data.canvasContentImageRect), scale);
    // }
    // return null;
    if (
      EditorManager.image &&
      EditorManager.canvas &&
      EditorSelector.getZoom() !== 1
    ) {
      let xScale = point.x / EditorSelector.getZoom();
      let yScale = point.y / EditorSelector.getZoom();
      let retPoint: IPoint = { x: xScale, y: yScale }
      return retPoint;
    }
    return point;
  }

  public static transferLineFromImageToCanvasContent(
    line: ILine,
    data: IEditor
  ): ILine | null {
    const startPoint = RenderUtils.transferPointFromImageToCanvasContent(
      line.start,
      data
    );
    const endPoint = RenderUtils.transferPointFromImageToCanvasContent(
      line.end,
      data
    );
    if (startPoint !== null && endPoint !== null) {
      return { start: startPoint, end: endPoint };
    }
    return null;
  }

  public static transferLineFromCanvasContentToImage(
    line: ILine,
    data: IEditor
  ): ILine | null {
    const startPoint = RenderUtils.transferPointFromCanvasContentToImage(
      line.start,
      data
    );
    const endPoint = RenderUtils.transferPointFromCanvasContentToImage(
      line.end,
      data
    );
    if (startPoint !== null && endPoint !== null) {
      return { start: startPoint, end: endPoint };
    }
    return null;
  }

  public static transferCircleFromCanvasContentToImage(
    line: ILine,
    data: IEditor
  ): ILine | null {
    const startPoint = RenderUtils.transferPointFromCanvasContentToImage(
      line.start,
      data
    );
    const endPoint = RenderUtils.transferPointFromCanvasContentToImage(
      line.end,
      data
    );
    if (startPoint !== null && endPoint !== null) {
      return { start: startPoint, end: endPoint };
    }
    return null;
  }

  public static transferRectFromImageToCanvasContent(
    rect: IRect,
    data: IEditor
  ): IRect | null {
    const scale: number | null = 1;//RenderUtils.calculateImageScale(data);
    if (scale !== null && data.canvasContentImageRect !== null) {
      const translation: IPoint = {
        x: -data.canvasContentImageRect.x,
        y: -data.canvasContentImageRect.y
      }

      return RectUtils.scale(RectUtils.translate(rect, translation), scale);
    }
    return null;
  }

  public static transferRectFromCanvasContentToImage(
    rect: IRect,
    data: IEditor
  ): IRect | null {
    const scale: number | null = 1;//RenderUtils.calculateImageScale(data);
    if (scale !== null && data.canvasContentImageRect !== null) {
      return RectUtils.translate(RectUtils.scale(rect, 1 / scale), data.canvasContentImageRect);
    }
    return null;
  }
}
