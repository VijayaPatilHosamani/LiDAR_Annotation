import { store } from "..";
import { updateCanvasSize } from "../Store/Editor/ActionCreators";
import { EditorConfigs } from "../Configs";
import { updateLabelsNames, updateActiveLabelId } from "../Store/Label/ActionCreators";
import { Labels } from "../Store/Label/types";
import { LabelTypes } from "../Types";

export default class AppInitializer {

    public static init(): void {
        AppInitializer.handleCanvasSize();
        AppInitializer.handleLabels();
    }


    private static handleCanvasSize() {
        store.dispatch(updateCanvasSize(
            {
                width: EditorConfigs.CANVAS_DEFAULT_WIDTH,
                height: EditorConfigs.CANVAS_DEFAULT_HEIGHT
            }
        ))
    }

    private static handleLabels() {
        let labels: Labels[] = [];
        labels[0] = {
            id: "None",
            name: "PointTest",
            type: LabelTypes.NONE
        }

        store.dispatch(updateLabelsNames(labels))
        store.dispatch(updateActiveLabelId("None"))

    }

}