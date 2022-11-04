import { IPoint, IRect } from "../../Types/Interfaces";
import { LabelTypes } from "../../Types";
import { ILine } from "../../Types/Interfaces/ILine";

export type Labels = {
  id: string;
  name: string;
  type: LabelTypes;
};

export type LabelPoint = {
  id: string;
  labelId: string;
  Point: IPoint;
  isHidden: boolean;
  annotation: string | null;
  annotationName: string | undefined;
};

export type LabelLine = {
  id: string;
  labelId: string;
  Line: ILine;
  isHidden: boolean;
  annotation: string | null;
  annotationName: string | undefined;
};

export type LabelCircle = {
  id: string;
  labelId: string;
  Line: ILine;
  radius: number;
  isHidden: boolean;
  annotation: string | null;
  annotationName: string | undefined;
};

export type LabelPolygon = {
  id: string;
  labelId: string;
  Lines: ILine[];
  isHidden: boolean;
  annotation: string | null;
  annotationName: string | undefined;
};

export type LabelPaintBrush = {
  id: string;
  labelId: string;
  Lines: ILine[];
  isHidden: boolean;
  LineThickness: number;
  LineColor: string;
  annotation: string | null;
  annotationName: string | undefined;
};


export type LabelSegmentation = {
  id: string;
  labelId: string;
  Lines: ILine[];
  isHidden: boolean;
  //LineThickness: number;
  LineColor: string;
  annotation: string | null;
  annotationName: string | undefined;
};


export type LableArrow = {
  id: string;
  labelId: string;
  Lines: ILine[];
  isHidden: boolean;
  annotation: string | null;
  annotationName: string | undefined;
};

export type LabelCuboid = {
  id: string;
  labelId: string;
  Lines: ILine[];
  isHidden: boolean;
  annotation: string | null;
  annotationName: string | undefined;
};

export type LabelArrow = {
  id: string;
  labelId: string;
  Lines: ILine[];
  isHidden: boolean;
  annotation: string | null;
  annotationName: string | undefined;
};

export type LabelFreehand = {
  id: string;
  labelId: string;
  Lines: ILine[];
  isHidden: boolean;
  annotation: string | null;
  annotationName: string | undefined;
};

export type LabelRect = {
  id: string;
  labelId: string;
  Rect: IRect;
  isHidden: boolean;
  annotation: string | null;
  annotationName: string | undefined;
};

export type ImageDataType = {
  id: string;
  fileData: File; //TODO: simply use s3 url no need for data,
  ImageURL: string;    //TODO: simply take url as that is what is used to display
  loaded: boolean;
  labelPoints: LabelPoint[];
  labelLines: LabelLine[];
  labelRects: LabelRect[];
  labelCircles: LabelCircle[];
  labelPolygon: LabelPolygon[];
  labelArrow: LabelArrow[];
  labelCuboid: LabelCuboid[];
  labelFreeHand: LabelFreehand[];
  labelPaintBrush: LabelPaintBrush[];
  labelSegmentation: LabelSegmentation[]
};

export type LabelsState = {
  // active or high-lighted element
  activeImageId: string | null;
  activeImageIndex: number | null;
  activeLabelId: string | null;
  activeLabelType: LabelTypes | null;
  highlightedLabelId: string | null;
  // store
  imagesData: ImageDataType[];
  labels: Labels[];
  // flags
  firstLabelCreated: boolean;
  isEditMode: boolean;
  inEditLabelId: string | null;
};

export enum Action {
  UPDATE_ACTIVE_IMAGE_ID = "UPDATE_ACTIVE_IMAGE_ID",
  UPDATE_ACTIVE_IMAGE_INDEX = "UPDATE_ACTIVE_IMAGE_INDEX",
  UPDATE_ACTIVE_LABEL_ID = "UPDATE_ACTIVE_LABEL_ID",
  UPDATE_ACTIVE_LABEL_TYPE = "UPDATE_ACTIVE_LABEL_TYPE",
  UPDATE_HIGHLIGHTED_LABEL_ID = "UPDATE_HIGHLIGHTED_LABEL_ID",


  ACTIVATE_EDIT_MODE = "ACTIVATE_EDIT_MODE",
  DE_ACTIVATE_EDIT_MODE = "DE_ACTIVATE_EDIT_MODE",

  UPDATE_IMAGE_DATA_BY_ID = "UPDATE_IMAGE_DATA_BY_ID",
  UPDATE_IMAGES_DATA = "UPDATE_IMAGES_DATA",
  UPDATE_LABELS_NAMES = "UPDATE_LABELS_NAMES",

  ADD_IMAGES_DATA = "ADD_IMAGES_DATA",
  UPDATE_FIRST_LABEL_CREATED = "UPDATE_FIRST_LABEL_CREATED",
}

interface Activate_EditMode {
  type: typeof Action.ACTIVATE_EDIT_MODE;
  activeImageId: string;
}

interface DeActivate_EditMode {
  type: typeof Action.DE_ACTIVATE_EDIT_MODE;
  activeImageId: string;
}


interface UpdateActiveImageId {
  type: typeof Action.UPDATE_ACTIVE_IMAGE_ID;
  activeImageId: string;
}

interface UpdateActiveImageIndex {
  type: typeof Action.UPDATE_ACTIVE_IMAGE_INDEX;
  activeImageIndex: number;
}

interface UpdateActiveLabelId {
  type: typeof Action.UPDATE_ACTIVE_LABEL_ID;
  activeLabelId: string | null;
}

interface UpdateActiveLabelType {
  type: typeof Action.UPDATE_ACTIVE_LABEL_TYPE;
  activeLabelType: LabelTypes;
}
interface UpdateHighlightedLabelId {
  type: typeof Action.UPDATE_HIGHLIGHTED_LABEL_ID;
  highlightedLabelId: string | null;
}

interface UpdateImageDataId {
  type: typeof Action.UPDATE_IMAGE_DATA_BY_ID;
  id: string;
  imagesData: ImageDataType;
}

interface UpdateImagesData {
  type: typeof Action.UPDATE_IMAGES_DATA;
  imagesData: ImageDataType[];
}

interface UpdateLabelsNames {
  type: typeof Action.UPDATE_LABELS_NAMES;
  labels: Labels[];
}

interface AddImagesData {
  type: typeof Action.ADD_IMAGES_DATA;
  imagesData: ImageDataType[];
}

interface UpdateFirstLabelCreated {
  type: typeof Action.UPDATE_FIRST_LABEL_CREATED;
  firstLabelCreated: boolean;
}

export type LabelsActionType =
  | UpdateActiveImageId
  | UpdateActiveImageIndex
  | UpdateActiveLabelId
  | UpdateActiveLabelType
  | UpdateHighlightedLabelId
  | UpdateImageDataId
  | UpdateImagesData
  | UpdateLabelsNames
  | AddImagesData
  | UpdateFirstLabelCreated
  | Activate_EditMode
  | DeActivate_EditMode
