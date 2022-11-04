import { DefaultRenderer, BaseRenderer } from '../Renderer'
import { IPoint, ISize, IRect } from '../Types/Interfaces';
import { canvasCursorHandler } from '../Handlers';

export class EditorManager {
    public static mainRenderer: DefaultRenderer;
    public static supportRenderer: BaseRenderer | null;
    public static canvasCursorHandler: canvasCursorHandler;

    public static editor: HTMLDivElement | null;
    public static canvas: HTMLCanvasElement | null;
    public static mousePositionIndicator: HTMLDivElement | null;
    public static cursor: HTMLDivElement | null;
    public static image: HTMLImageElement | null;

    public static isLoading: boolean;
    public static CanvasActionsDisabled: boolean;

    public static mousePositionOnCanvasContent: IPoint;
    public static CanvasSize: ISize;
    public static defaultRenderImageRect: IRect;

}