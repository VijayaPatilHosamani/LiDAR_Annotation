import { LabelTypes, UtilTypes } from "../Types";
import { EditorManager } from "../Managers";
import { PointRenderer, DefaultRenderer, LineRenderer, RectRenderer,CircleRenderer, ArrowRenderer, CuboidRenderer, FreehandRenderer, PaintBrushRenderer, SegmentationRenderer } from "../Renderer";
import { DrawUtils, CanvasUtils, ImageUtils } from "../Utils";
import { IEditor, ISize } from "../Types/Interfaces";
import { EditorSelector } from "../Store/Editor";
import { CanvasActions } from "./CanvasActions";
import { canvasCursorHandler } from "../Handlers";
import { store } from "..";
import { updateActiveLabelId } from "../Store/Label/ActionCreators";
import { MeasureRenderer } from "../Renderer/MeasureRenderer";
import { PolygonRenderer } from "../Renderer/PolygonRenderer";

export class EditorActions {
    public static mountSupportRenderer(activeType: LabelTypes | UtilTypes) {
        store.dispatch(updateActiveLabelId("None"));
        if (EditorManager.canvas) {
            if (EditorSelector.getHideStatus()) {
                switch (activeType) {
                    case UtilTypes.MEASUREMENT: {
                        EditorManager.supportRenderer = new MeasureRenderer(EditorManager.canvas);
                        break;
                    }
                    default: {
                        EditorManager.supportRenderer = null;
                        break;
                    }
                }
                return;
            }
            switch (activeType) {
                case LabelTypes.POINT: {
                    EditorManager.supportRenderer = new PointRenderer(EditorManager.canvas);
                    break;
                }
                case LabelTypes.LINE: {
                    EditorManager.supportRenderer = new LineRenderer(EditorManager.canvas);
                    break;
                }
                case LabelTypes.RECTANGLE: {
                    EditorManager.supportRenderer = new RectRenderer(EditorManager.canvas);
                    break;
                }
                case LabelTypes.CIRCLE: {
                    EditorManager.supportRenderer = new CircleRenderer(EditorManager.canvas);
                    break;
                }
                case LabelTypes.POLYGON: {
                    EditorManager.supportRenderer = new PolygonRenderer(EditorManager.canvas);
                    break;
                }
                case LabelTypes.SEGMENTATION: {
                    EditorManager.supportRenderer = new SegmentationRenderer(EditorManager.canvas);
                    break;
                }
                case LabelTypes.ARROW: {
                    EditorManager.supportRenderer = new ArrowRenderer(EditorManager.canvas);
                    break;
                }case LabelTypes.CUBOID: {
                    EditorManager.supportRenderer = new CuboidRenderer(EditorManager.canvas);
                    break;
                }case LabelTypes.FREEHAND: {
                    EditorManager.supportRenderer = new FreehandRenderer(EditorManager.canvas);
                    break;
                }
                case LabelTypes.PAINTBRUSH: {
                    EditorManager.supportRenderer = new PaintBrushRenderer(EditorManager.canvas);
                    break;
                }
                case UtilTypes.MEASUREMENT: {
                    EditorManager.supportRenderer = new MeasureRenderer(EditorManager.canvas);
                    break;
                }
                default: {
                    EditorManager.supportRenderer = null;
                    break;
                }

            }
        }

    }
    public static swapSupportRenderer(activeType: LabelTypes | UtilTypes) {
        EditorActions.mountSupportRenderer(activeType);
    }

    public static mountRendererAndHandlers(activeType: LabelTypes | UtilTypes | null) {
        EditorManager.canvasCursorHandler = new canvasCursorHandler();
        if (EditorManager.canvas) {
            EditorManager.mainRenderer = new DefaultRenderer(EditorManager.canvas);
        }
        if (activeType) {
            EditorActions.mountSupportRenderer(activeType)
        }
    }

    // getters
    public static getEditorData(event?: Event): IEditor {
        let canvasContentSize: ISize | null = null;
        let imageSize: ISize | null = null;

        if (EditorManager.canvas) {
            canvasContentSize = CanvasUtils.getSize(EditorManager.canvas)
        }

        if (EditorManager.image) {
            imageSize = ImageUtils.getSize(EditorManager.image)
        }

        return {
            mousePositionOnCanvasContent: EditorManager.mousePositionOnCanvasContent,
            canvasSize: EditorManager.CanvasSize,
            canvasContentSize: canvasContentSize,
            zoom: EditorSelector.getZoom(),
            defaultImageRect: EditorManager.defaultRenderImageRect,
            canvasContentImageRect: CanvasActions.calculateCanvasContentImageRect(),
            realImageSize: imageSize,
            event: event,
        }
    }

    // setters
    public static setLoadingStatus(status: boolean) {
        EditorManager.isLoading = status;
    }

    public static setActiveImage(image: HTMLImageElement) {
        EditorManager.image = image;
    }

    public static setCanvasActionsDisabledStatus(status: boolean) {
        EditorManager.CanvasActionsDisabled = status;
    }

    // Render
    public static fullRender() {
        if (EditorManager && EditorManager.canvas) {
            let data: IEditor = EditorActions.getEditorData()
            DrawUtils.clearCanvas(EditorManager.canvas);
            EditorManager.mainRenderer && EditorManager.mainRenderer.render(data);
            EditorManager.supportRenderer && EditorManager.supportRenderer.render(data);
        }
    }
}