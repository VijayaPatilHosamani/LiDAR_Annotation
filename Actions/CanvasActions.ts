import { EditorManager } from "../Managers";
import { IRect, ISize, IPoint } from "../Types/Interfaces";
import { EditorSelector } from "../Store/Editor";
import { SizeUtil, RectUtils, NumberUtils, ImageUtils } from "../Utils";
import { EditorConfigs } from "../Configs";
import { PointUtils } from "../Utils/PointUtils";
import { EditorActions } from "./EditorActions";
import { updateZoom } from "../Store/Editor/ActionCreators";
import { store } from "..";

export class CanvasActions {
  public static updateCanvasSize() {
    if (EditorManager.editor) {
      EditorManager.CanvasSize = {
        width: EditorManager.editor.offsetWidth,
        height: EditorManager.editor.offsetHeight,
      };
    }
  }

  public static updateDefaultCanvasImageRect() {
    if (EditorManager.CanvasSize && EditorManager.image) {
      const minMargin: IPoint = {
        x: EditorConfigs.CANVAS_MIN_MARGIN_PX,
        y: EditorConfigs.CANVAS_MIN_MARGIN_PX,
      };
      const imageSize: ISize | null = ImageUtils.getSize(EditorManager.image);

      if (imageSize) {
        const realImageRect: IRect = { x: 0, y: 0, ...imageSize };
        const viewPortWithMarginRect: IRect = {
          x: 0,
          y: 0,
          ...EditorManager.CanvasSize,
        };
        const viewPortWithoutMarginRect: IRect = RectUtils.expand(
          viewPortWithMarginRect,
          PointUtils.multiply(minMargin, -1)
        );
        let realImageRatio: number | null = RectUtils.getRatio(realImageRect);
        if (realImageRatio) {
          EditorManager.defaultRenderImageRect = RectUtils.fitInsideRectWithRatio(
            viewPortWithoutMarginRect,
            realImageRatio
          );
        }
      }
    }
  }

  public static calculateCanvasContentSize(): ISize | null {
    if (EditorManager.CanvasSize && EditorManager.image) {
      const defaultRenderImageRect: IRect =
        EditorManager.defaultRenderImageRect;
      const scaledImageSize: ISize = SizeUtil.scale(
        defaultRenderImageRect,
        EditorSelector.getZoom()
      );

      return {
        width: scaledImageSize.width + 2 * defaultRenderImageRect.x,
        height: scaledImageSize.height + 2 * defaultRenderImageRect.y,
      };
    } else {
      return null;
    }
  }

  public static calculateCanvasContentImageRect(): IRect | null {
    if (EditorManager.CanvasSize && EditorManager.image) {
      const defaultRenderImageRect: IRect =
        EditorManager.defaultRenderImageRect;
      const canvasContentSize: ISize | null = CanvasActions.calculateCanvasContentSize();
      if (canvasContentSize) {
        return {
          ...defaultRenderImageRect,
          width: canvasContentSize.width - 2 * defaultRenderImageRect.x,
          height: canvasContentSize.height - 2 * defaultRenderImageRect.y,
        };
      }
    }
    return null;
  }

  public static resizeCanvas(newCanvasSize: ISize) {
    if (newCanvasSize && EditorManager.canvas) {
      EditorManager.canvas.width = newCanvasSize.width;
      EditorManager.canvas.height = newCanvasSize.height;
    }
  }

  public static resizeCanvasContent() {
    CanvasActions.calculateCanvasContentSize();
  }

  public static zoomIn() {
    if (EditorManager.CanvasActionsDisabled) return;

    const currentZoom: number = EditorSelector.getZoom();
    CanvasActions.setZoom(currentZoom + EditorConfigs.ZOOM_STEP);
    //  CanvasActions.resizeCanvasContent();
    // let resizedDimensions = this.calculateCanvasContentSize();
    // if (resizedDimensions) {
    //   CanvasActions.resizeCanvas(resizedDimensions);
    // }

    //EditorActions.fullRender();
  }

  public static zoomOut() {
    if (EditorManager.CanvasActionsDisabled) return;

    const currentZoom: number = EditorSelector.getZoom();
    CanvasActions.setZoom(currentZoom - EditorConfigs.ZOOM_STEP);
    let resizedDimensions = this.calculateCanvasContentSize();
    if (resizedDimensions) {
      CanvasActions.resizeCanvas(resizedDimensions);
    }
    //CanvasActions.resizeCanvasContent();
    EditorActions.fullRender();
  }

  public static setDefaultZoom() {
    CanvasActions.setZoom(EditorConfigs.MIN_ZOOM);
    CanvasActions.resizeCanvasContent();
    EditorActions.fullRender();
  }

  public static setOneForOneZoom() {
    if (EditorManager.image) {
      const nextZoom: number =
        EditorManager.image.width / EditorManager.defaultRenderImageRect.width;
      CanvasActions.setZoom(nextZoom);
      CanvasActions.resizeCanvasContent();
      EditorActions.fullRender();
    }
  }

  public static setZoom(value: number) {
    const currentZoom: number = EditorSelector.getZoom();
    const isNewValueValid: boolean = NumberUtils.isValueInRange(
      value,
      EditorConfigs.MIN_ZOOM,
      EditorConfigs.MAX_ZOOM
    );
    if (isNewValueValid && value !== currentZoom) {
      store.dispatch(updateZoom(value));
    }
  }
}
