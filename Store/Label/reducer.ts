import { LabelsState, LabelsActionType, Action, ImageDataType } from "./types";

const initialState: LabelsState = {
  activeImageId: null,
  activeImageIndex: null,
  activeLabelId: null,
  activeLabelType: null,
  highlightedLabelId: null,
  // stores
  imagesData: [],
  labels: [],
  //flags
  firstLabelCreated: false,
  inEditLabelId: null,
  isEditMode: false,
};

export function labelReducer(
  state: LabelsState = initialState,
  action: LabelsActionType
): LabelsState {
  switch (action.type) {
    case Action.ACTIVATE_EDIT_MODE: {
      var cht = {
        ...state,
        inEditLabelId: action.activeImageId,
        isEditMode: true,
      };
      return cht;
    }
    case Action.DE_ACTIVATE_EDIT_MODE: {
      return {
        ...state,
        inEditLabelId: null,
        isEditMode: false,
      };
    }
    case Action.UPDATE_ACTIVE_IMAGE_ID: {
      return {
        ...state,
        activeImageId: action.activeImageId,
      };
    }

    case Action.UPDATE_ACTIVE_LABEL_ID: {
      return {
        ...state,
        activeLabelId: action.activeLabelId,
      };
    }

    case Action.UPDATE_ACTIVE_IMAGE_INDEX: {
      return {
        ...state,
        activeImageIndex: action.activeImageIndex,
      };
    }

    case Action.UPDATE_ACTIVE_LABEL_TYPE: {
      return {
        ...state,
        activeLabelType: action.activeLabelType,
      };
    }

    case Action.UPDATE_HIGHLIGHTED_LABEL_ID: {
      return {
        ...state,
        highlightedLabelId: action.highlightedLabelId,
      };
    }

    case Action.UPDATE_FIRST_LABEL_CREATED: {
      return {
        ...state,
        firstLabelCreated: action.firstLabelCreated,
      };
    }

    case Action.UPDATE_IMAGE_DATA_BY_ID: {
      return {
        ...state,
        imagesData: state.imagesData.map((imagesData: ImageDataType) =>
          imagesData.id === action.id ? action.imagesData : imagesData
        ),
      };
    }

    case Action.ADD_IMAGES_DATA: {
      ;
      return {
        ...state,
        imagesData: action.imagesData, //state.imagesData.concat(action.imagesData)
      };
    }

    case Action.UPDATE_IMAGES_DATA: {
      return {
        ...state,
        imagesData: action.imagesData,
      };
    }
    case Action.UPDATE_LABELS_NAMES: {
      return {
        ...state,
        labels: action.labels,
      };
    }

    default:
      return state;
  }
}
