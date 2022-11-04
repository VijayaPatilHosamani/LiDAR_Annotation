import { ImageDataType, Labels, LabelsActionType } from "./types";
import { Action } from "./types";
import { LabelTypes } from "../../Types";


export function activate_EditMode(activeImageId: string): LabelsActionType {
    return {
        type: Action.ACTIVATE_EDIT_MODE,
        activeImageId: activeImageId,
    }
}
export function deactivate_EditMode(activeImageId: string): LabelsActionType {
    return {
        type: Action.DE_ACTIVATE_EDIT_MODE,
        activeImageId: activeImageId,
    }
}

export function updateActiveImageId(activeImageId: string): LabelsActionType {
    return {
        type: Action.UPDATE_ACTIVE_IMAGE_ID,
        activeImageId: activeImageId,
    }
}

export function updateActiveImageIndex(activeImageIndex: number): LabelsActionType {
    return {
        type: Action.UPDATE_ACTIVE_IMAGE_INDEX,
        activeImageIndex: activeImageIndex,
    }
}

export function updateActiveLabelId(activeLabelId: string | null): LabelsActionType {
    return {
        type: Action.UPDATE_ACTIVE_LABEL_ID,
        activeLabelId: activeLabelId,
    }
}

export function updateActiveLabelType(activeLabelType: LabelTypes): LabelsActionType {
    return {
        type: Action.UPDATE_ACTIVE_LABEL_TYPE,
        activeLabelType: activeLabelType,
    }
}


//
export function activateEditMode(activeImageId: string): LabelsActionType {
    return {
        type: Action.ACTIVATE_EDIT_MODE,
        activeImageId: activeImageId
    }
}


export function deActivateEditMode(activeImageId: string): LabelsActionType {
    return {
        type: Action.DE_ACTIVATE_EDIT_MODE,
        activeImageId: activeImageId
    }
}
//

export function updateHighlightedLabelId(highlightedLabelId: string | null): LabelsActionType {
    return {
        type: Action.UPDATE_HIGHLIGHTED_LABEL_ID,
        highlightedLabelId: highlightedLabelId,
    }
}


export function updateImageDataById(id: string, imagesData: ImageDataType): LabelsActionType {
    return {
        type: Action.UPDATE_IMAGE_DATA_BY_ID,
        id: id,
        imagesData: imagesData,
    }
}

export function updateImagesData(imagesData: ImageDataType[]): LabelsActionType {
    return {
        type: Action.UPDATE_IMAGES_DATA,
        imagesData: imagesData,
    }
}

export function updateLabelsNames(labels: Labels[]): LabelsActionType {
    return {
        type: Action.UPDATE_LABELS_NAMES,
        labels: labels,
    }
}


export function addImagesData(imagesData: ImageDataType[]): LabelsActionType {
    return {
        type: Action.ADD_IMAGES_DATA,
        imagesData: imagesData,
    }
}

export function updateFirstLabelCreated(firstLabelCreated: boolean): LabelsActionType {
    return {
        type: Action.UPDATE_FIRST_LABEL_CREATED,
        firstLabelCreated: firstLabelCreated,
    }
}
