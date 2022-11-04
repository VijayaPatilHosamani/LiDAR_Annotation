import React from 'react';
import EditorContainer from './EditorContainer/EditorContainer';
import EditorInformation from './EditorInformation/EditorInformation';
import { connect } from 'react-redux';
import { AppState } from '../../Store';
import { ImageDataType } from '../../Store/Label';
import ToolBox from "./ToolBox";

import "./EditorView.scss"

interface IProps {
    imagesData: ImageDataType[],
    ProjectDetails: any,
    readonly: boolean,
}

const EditorView: React.FC<IProps> = ({ imagesData, ProjectDetails,readonly }) => {
    if (imagesData.length > 0) {
        return (
            <div id="EditorView" draggable={false}>
                <ToolBox ProjectDetails={ ProjectDetails} readonly={ readonly}/>
                <div id="EditorBox">
                    <EditorContainer />
                    <EditorInformation ProjectDetails={ ProjectDetails}/>
                </div>
            </div>
        );
    }
    else {
        return (
            <>
                <div draggable={false}>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    imagesData: state.labels.imagesData,
  //  ProjectDetails :any
});

export default connect(mapStateToProps)(EditorView);
