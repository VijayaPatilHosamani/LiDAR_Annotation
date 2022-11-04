import { store } from "../.."
import { ImageDataType, Labels, LabelPoint, LabelLine } from "./types"
import { find } from "lodash";
import { LabelTypes } from "../../Types";
import { LabelRect } from ".";


export class LabelsSelector {

    public static getActiveImageId(): string | null {
        return store.getState().labels.activeImageId;
    }

    public static getActiveImageIndex(): number | null {
        return store.getState().labels.activeImageIndex;
    }

    public static getActiveLabelId(): string | null {
        return store.getState().labels.activeLabelId;
    }

    public static getActiveLabelType(): LabelTypes | null {
        return store.getState().labels.activeLabelType;
    }

    public static getHighlightedLabelId(): string | null {
        return store.getState().labels.highlightedLabelId;
    }

    public static getLabels(): Labels[] {
        return store.getState().labels.labels;
    }

    public static getImagesData(): ImageDataType[] | null {
        return store.getState().labels.imagesData;
    }
    public static getFirstActiveLabel(): boolean {
        return store.getState().labels.firstLabelCreated;
    }

    public static getImageDataByIndex(index: number): ImageDataType | null {
        return store.getState().labels.imagesData[index];
    }

    public static getActiveImageData(): ImageDataType | null {
        const activeImageIndex: number | null = LabelsSelector.getActiveImageIndex();

        if (activeImageIndex === null) {
            return null;
        }

        return store.getState().labels.imagesData[activeImageIndex];
    }

    public static getImageDataById(Id: string): ImageDataType | null {
        const imagesData: ImageDataType[] | null = LabelsSelector.getImagesData();

        if (imagesData === null) {
            return null;
        }
        let found: ImageDataType | undefined = find(imagesData, { id: Id })
        if (found !== undefined) {
            return found;
        }

        return null;
    }

    public static getActivePointLabel(): LabelPoint | null {
        const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
        const activeImageData: ImageDataType | null = LabelsSelector.getActiveImageData();

        if (activeLabelId === null || activeImageData === null) {
            return null;
        }
        const activePointLabel: LabelPoint | undefined = find(activeImageData.labelPoints, { id: activeLabelId })
        if (activePointLabel) {
            return activePointLabel;
        }
        return null;
    }

    public static getActiveLineLabel(): LabelLine | null {
        const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
        const activeImageData: ImageDataType | null = LabelsSelector.getActiveImageData();

        if (activeLabelId === null || activeImageData === null) {
            return null;
        }
        const activeLineLabel: LabelLine | undefined = find(activeImageData.labelLines, { id: activeLabelId })
        if (activeLineLabel) {
            return activeLineLabel;
        }
        return null;
    }

    static getActiveRectLabel(): LabelRect | null {
        const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
        const activeImageData: ImageDataType | null = LabelsSelector.getActiveImageData();

        if (activeLabelId === null || activeImageData === null) {
            return null;
        }
        const activeRectLabel: LabelRect | undefined = find(activeImageData.labelRects, { id: activeLabelId })
        if (activeRectLabel) {
            return activeRectLabel;
        }
        return null;
    }
}
