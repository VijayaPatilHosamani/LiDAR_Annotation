import { ISize } from "../../Types/Interfaces";
import { UtilTypes } from "../../Types";

export type EditorState = {
  canvasSize: ISize | null;
  imageDragMode: boolean;
  crossHairVisible: boolean;
  zoom: number;
  activeUtilType: UtilTypes | null;
  Measurement: ISize;
  Hide: boolean;
  sharpen: number;
  blur: number;
  grayscale: number;
  brightness: number;
  contrast: number;
  paintBrushThickness: number;
  paintBrushColor: string;
  DoState:any,
  UndoState:any,
  //RedoState:any
};

export enum Action {
  DO_STATE = "DO_STATE",
  UNDO_STATE = "UNDO_STATE",
  REDO_STATE = "REDO_STATE",

  UPDATE_CANVAS_SIZE = "UPDATE_WINDOW_SIZE",
  UPDATE_IMAGE_DRAG_STATUS = "UPDATE_IMAGE_DRAG_STATUS",
  UPDATE_ZOOM = "UPDATE_ZOOM",
  UPDATE_ACTIVE_UTIL_TYPE = "UPDATE_ACTIVE_UTIL_TYPE",
  UPDATE_MEASUREMENT = "UPDATE_MEASUREMENT",
  UPDATE_HIDE = "UPDATE_HIDE",
  UPDATE_SHARPEN = "UPDATE_SHARPEN",
  UPDATE_BLUR = "UPDATE_BLUR",
  UPDATE_GRAYSCALE = "UPDATE_GRAYSCALE",
  UPDATE_BRIGHTNESS = "UPDATE_BRIGHTNESS",
  UPDATE_CONTRAST = "UPDATE_CONTRAST",
  UPDATE_PAINTBRUSH_THICKNESS = "UPDATE_PAINTBRUSH_THICKNESS",
  UPDATE_PAINTBRUSH_COLOR="UPDATE_PAINTBRUSH_COLOR"
}

interface DoState { 
  type: typeof Action.DO_STATE;
  data: string;
}

interface UndoState {
  type: typeof Action.UNDO_STATE;
  data: string;
 }

interface RedoState { 
  type: typeof Action.REDO_STATE;
  data: string;
}

interface UpdateCanvasSize {
  type: typeof Action.UPDATE_CANVAS_SIZE;
  canvasSize: ISize;
}
interface UpdateImageDragStatus {
  type: typeof Action.UPDATE_IMAGE_DRAG_STATUS;
  imageDragMode: boolean;
}

interface UpdateZoom {
  type: typeof Action.UPDATE_ZOOM;
  zoom: number;
}

interface UpdateGrayscale {
  type: typeof Action.UPDATE_GRAYSCALE;
  grayscale: number;
}
interface UpdateSharpen {
  type: typeof Action.UPDATE_SHARPEN;
  sharpen: number;
}
interface UpdateBlur {
  type: typeof Action.UPDATE_BLUR;
  blur: number;
}
interface UpdateBrightness {
  type: typeof Action.UPDATE_BRIGHTNESS;
  brightness: number;
}
interface UpdateConstrast {
  type: typeof Action.UPDATE_CONTRAST;
  contrast: number;
}

interface UpdatePaintBrushThickness {
  type: typeof Action.UPDATE_PAINTBRUSH_THICKNESS;
  thickness: number;
}
interface UpdatePaintBrushColor {
  type: typeof Action.UPDATE_PAINTBRUSH_COLOR;
  color: string;
}


interface UpdateMeasurement {
  type: typeof Action.UPDATE_MEASUREMENT;
  Measurement: ISize;
}
interface UpdateActiveUtilType {
  type: typeof Action.UPDATE_ACTIVE_UTIL_TYPE;
  activeUtilType: UtilTypes | null;
}

interface UpdateHide {
  type: typeof Action.UPDATE_HIDE;
  Hide: boolean;
}

export type EditorActionTypes =
  | UpdateCanvasSize
  | UpdateImageDragStatus
  | UpdateZoom
  | UpdateMeasurement
  | UpdateActiveUtilType
  | UpdateHide
  | UpdateSharpen
  | UpdateBlur
  | UpdateGrayscale
  | UpdateBrightness
  | UpdateConstrast
  | UpdatePaintBrushThickness
  | UpdatePaintBrushColor
  | UndoState
  | RedoState
  | DoState