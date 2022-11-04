import React from 'react';
import { ISize } from "../../../Types/Interfaces";
import { ImageDataType } from "../../../Store/Label";
import { AppState } from '../../../Store';
import { connect } from 'react-redux';
import { EditorConfigs } from '../../../Configs';
import Editor from './Editor/Editor'


interface IProps {
    canvasSize: ISize | null;
    activeImageIndex: number | null;
    imagesData: ImageDataType[];
}

const EditorContainer: React.FC<IProps> = (props: IProps) => {
    const calculateEditorSize = (): ISize => {
        if (props.canvasSize) {
            return props.canvasSize;
        }
        else {
            return { width: EditorConfigs.CANVAS_DEFAULT_WIDTH, height: EditorConfigs.CANVAS_DEFAULT_HEIGHT }
        }
    }
    let activeImageIndex = 0;
    if (props.activeImageIndex) {
        activeImageIndex = props.activeImageIndex;
    }
    return (
        <div id="EditorContainer">
            <Editor canvasSize={calculateEditorSize()}
                imageData={props.imagesData[activeImageIndex]} key={"editor"} />
        </div>
    )
}

const mapStateToProps = (state: AppState) => ({
    canvasSize: state.Editor.canvasSize,
    activeImageIndex: state.labels.activeImageIndex,
    imagesData: state.labels.imagesData
});

export default connect(mapStateToProps)(EditorContainer);