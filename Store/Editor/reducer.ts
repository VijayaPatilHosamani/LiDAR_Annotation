import { EditorActionTypes, EditorState, Action } from "./types";


const initialState: EditorState = {
  canvasSize: null,
  imageDragMode: false,
  crossHairVisible: true,
  zoom: 1,
  activeUtilType: null,
  Measurement: { width: 0, height: 0 },
  Hide: false,
  sharpen: 0,
  blur: 0,
  grayscale: 0,
  brightness: 0,
  contrast: 0,
  paintBrushColor: "red",
  paintBrushThickness: 15,
  DoState: [],
  UndoState: [],
  //RedoState: [],
};

export function EditorReducer(
  state = initialState,
  action: EditorActionTypes
): EditorState {
  switch (action.type) {
    case Action.DO_STATE: {
      //let maxStates = 10000;
      let newDoState = state.DoState;
      //if (state.DoState.length > maxStates){
        // newDoState.shift()
      //}
      return {
        ...state,
        DoState: newDoState.concat(action.data),
      };
    }
    case Action.UNDO_STATE: {
      return {
        ...state,
        UndoState: state.UndoState.concat(action.data),
      };
    }
    // case Action.REDO_STATE: {
    //   return {
    //     ...state,
    //     RedoState: state.RedoState.concat(action.data),
    //   };
    // }
    case Action.UPDATE_CANVAS_SIZE: {
      return {
        ...state,
        canvasSize: action.canvasSize,
      };
    }
    case Action.UPDATE_IMAGE_DRAG_STATUS: {
      return {
        ...state,
        imageDragMode: action.imageDragMode,
      };
    }
    case Action.UPDATE_ZOOM: {
      return {
        ...state,
        zoom: action.zoom,
      };
    }
    case Action.UPDATE_SHARPEN: {
      return {
        ...state,
        sharpen: action.sharpen,
      };
    }
    case Action.UPDATE_BLUR: {
      return {
        ...state,
        blur: action.blur,
      };
    }

    case Action.UPDATE_BRIGHTNESS: {
      return {
        ...state,
        brightness: action.brightness,
      };
    }

    case Action.UPDATE_CONTRAST: {
      return {
        ...state,
        contrast: action.contrast,
      };
    }

    case Action.UPDATE_PAINTBRUSH_THICKNESS: {
      return {
        ...state,
        paintBrushThickness: action.thickness,
      };
    }

    case Action.UPDATE_PAINTBRUSH_COLOR: {
      return {
        ...state,
        paintBrushColor: action.color,
      };
    }

    case Action.UPDATE_GRAYSCALE: {
      return {
        ...state,
        grayscale: action.grayscale,
      };
    }
    case Action.UPDATE_MEASUREMENT: {
      return {
        ...state,
        Measurement: action.Measurement,
      };
    }
    case Action.UPDATE_ACTIVE_UTIL_TYPE: {
      return {
        ...state,
        activeUtilType: action.activeUtilType,
      };
    }
    case Action.UPDATE_HIDE: {
      return {
        ...state,
        Hide: action.Hide,
      };
    }
    default:
      return state;
  }
}
