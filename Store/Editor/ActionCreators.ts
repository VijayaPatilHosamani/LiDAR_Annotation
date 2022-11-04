import { ISize } from "../../Types/Interfaces";
import { EditorActionTypes, Action } from "./types";
import { UtilTypes } from "../../Types";


export function DoState(data: string): EditorActionTypes {
  //  alert('asdf');
  return {
    type: Action.DO_STATE,
    data: data
  };
}

export function RedoState(data: string): EditorActionTypes {
  return {
    type: Action.REDO_STATE,
    data: data
  };
}

export function UndoState(data: string): EditorActionTypes {
  return {
    type: Action.UNDO_STATE,
    data: data
  };
}




export function updateCanvasSize(canvasSize: ISize): EditorActionTypes {
  return {
    type: Action.UPDATE_CANVAS_SIZE,
    canvasSize: canvasSize,
  };
}

export function updateImageDragModeStatus(
  imageDragMode: boolean
): EditorActionTypes {
  return {
    type: Action.UPDATE_IMAGE_DRAG_STATUS,
    imageDragMode: imageDragMode,
  };
}

export function updateActiveUtilType(
  activeUtilType: UtilTypes | null
): EditorActionTypes {
  return {
    type: Action.UPDATE_ACTIVE_UTIL_TYPE,
    activeUtilType: activeUtilType,
  };
}

export function updateZoom(zoom: number): EditorActionTypes {
  return {
    type: Action.UPDATE_ZOOM,
    zoom: zoom,
  };
}

export function updateSharpen(sharpen: number): EditorActionTypes {
  return {
    type: Action.UPDATE_SHARPEN,
    sharpen: sharpen,
  };
}
export function updatePaintBrushThickness(
  thickness: number
): EditorActionTypes {
  return {
    type: Action.UPDATE_PAINTBRUSH_THICKNESS,
    thickness: thickness,
  };
}

export function updatePaintBrushColor(color: string): EditorActionTypes {
  return {
    type: Action.UPDATE_PAINTBRUSH_COLOR,
    color: color,
  };
}

export function updateBlur(blur: number): EditorActionTypes {
  return {
    type: Action.UPDATE_BLUR,
    blur: blur,
  };
}

export function updateBrightness(brightness: number): EditorActionTypes {
  return {
    type: Action.UPDATE_BRIGHTNESS,
    brightness: brightness,
  };
}
export function updateContrast(contrast: number): EditorActionTypes {
  return {
    type: Action.UPDATE_CONTRAST,
    contrast: contrast,
  };
}

export function updateGrayscale(grayscale: number): EditorActionTypes {
  return {
    type: Action.UPDATE_GRAYSCALE,
    grayscale: grayscale,
  };
}

export function updateMeasurement(Measurement: ISize): EditorActionTypes {
  return {
    type: Action.UPDATE_MEASUREMENT,
    Measurement: Measurement,
  };
}

export function updateHideStatus(Hide: boolean): EditorActionTypes {
  return {
    type: Action.UPDATE_HIDE,
    Hide: Hide,
  };
}
