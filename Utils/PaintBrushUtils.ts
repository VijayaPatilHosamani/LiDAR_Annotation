/* eslint-disable @typescript-eslint/no-unused-vars */
import { ILine, IPoint, IEditor } from "../Types/Interfaces";
import { LabelsSelector, ImageDataType } from "../Store/Label";
import { RenderUtils, DrawUtils } from ".";
import { LabelPaintBrush } from "../Store/Label/types";

export class PaintBrushUtils {
  public static getDistanceFromLine(line: ILine, point: IPoint): number | null {
    if (line.start.x !== line.end.x || line.start.y !== line.end.y) {
      const denom: number = Math.sqrt(
        Math.pow(line.end.y - line.start.y, 2) +
        Math.pow(line.end.x - line.start.x, 2)
      );
      const nom: number = Math.abs(
        (line.end.y - line.start.y) * point.x -
        (line.end.x - line.start.x) * point.y +
        line.end.x * line.start.y -
        line.end.y * line.start.x
      );
      return nom / denom;
    }
    return null;
  }

  public static getCenterPoint(line: ILine): IPoint {
    return {
      x: (line.start.x + line.end.x) / 2,
      y: (line.start.y + line.end.y) / 2,
    };
  }

  public static drawExistingPaintBrush(
    canvas: HTMLCanvasElement,
    data: IEditor
  ): void {
    const imageData: ImageDataType | null = LabelsSelector.getActiveImageData();
    if (imageData) {
      imageData.labelPaintBrush.forEach((labelPolygon: LabelPaintBrush) => {

        if (!labelPolygon.isHidden) {
          labelPolygon.Lines.forEach((element: any) => {
            const startOnCanvas: IPoint | null = //element.Line.start;
              RenderUtils.transferPointFromImageToCanvasContent(
                element.Line.start, // .Line.start,
                data
              );
            const endOnCanvas: IPoint | null =// element.Line.end;
              RenderUtils.transferPointFromImageToCanvasContent(
                element.Line.end, //Line.end,
                data
              );
            if (startOnCanvas && endOnCanvas) {
              const standardizedLine: ILine = {
                start: RenderUtils.setPointBetweenPixels(startOnCanvas),
                end: RenderUtils.setPointBetweenPixels(endOnCanvas),
              };


              DrawUtils.drawLinePaintBrush(
                canvas,
                standardizedLine.start,
                standardizedLine.end,
                labelPolygon.LineColor,  //labelPolygon.LineColor,
                labelPolygon.LineThickness//EditorSelector.getPaintBrushThickness()//  labelPolygon.LineThickness
                // LineConfigs.LINE_INACTIVE_COLOR,
                // LineConfigs.LINE_THICKNESS
              );
            }
          });

        }


      });
    }
  }
}
