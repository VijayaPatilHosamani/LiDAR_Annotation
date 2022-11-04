import React from "react";
import ImageDropZone from "./ImageDropZone/ImageDropZone";
import VideoDropZone from "./VideoDropZone/VideoDropZone";

export class SettingsView extends React.Component<{}, {}>{

    render() {
        return (
            <div className="settings">
                <ImageDropZone />
                <VideoDropZone/>
            </div>
        )
    }

}