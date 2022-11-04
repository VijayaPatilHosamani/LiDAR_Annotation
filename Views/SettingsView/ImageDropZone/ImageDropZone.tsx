import React from "react";
import { ImageDataType } from "../../../Store/Label";
import { FileUtils } from "../../../Utils";
import { addImagesData, updateActiveImageIndex } from "../../../Store/Label/ActionCreators";

import { useDropzone, DropzoneOptions } from "react-dropzone";
import { connect } from "react-redux";


import { ReactComponent as UploadLogo } from "../../../assets/Upload.svg"
import { ReactComponent as DoneLogo } from "../../../assets/CheckMark.svg"

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    addImagesData: (imagesData: ImageDataType[]) => any;
}

const ImageDropZone: React.FC<IProps> = ({
    updateActiveImageIndex,
    addImagesData
}) => {
    const startEditor = () => {
        if (acceptedFiles.length > 0) {

            updateActiveImageIndex(0);
            addImagesData(acceptedFiles.map((fileData: File) => FileUtils.mapFileDataToImageData(fileData)));
        }
    };

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: 'image/jpeg, image/png'
    } as DropzoneOptions);


    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return (<div draggable={false}>
                <input {...getInputProps()} />
                <UploadLogo height={"100"} width={"100"} />
                <p>Drop some images</p>
                <p>or</p>
                <p>Click here to select them</p>
            </div>);
        else if (acceptedFiles.length === 1)
            return (<div draggable={false}>
                <DoneLogo height={"100"} width={"100"} />
                <p>1 image loaded</p>
                <button onClick={() => startEditor()}> Accept Image </button>
            </div>);
        else
            return (<div draggable={false}>
                <input {...getInputProps()} />
                <DoneLogo height={"100"} width={"100"} />
                <p>{acceptedFiles.length} images loaded</p>
                <button onClick={() => startEditor()}> Accept Images </button>
            </div>);
    };


    return (
        <div className="ImagesDropZone">
            <div {...getRootProps({ className: 'DropZone' })}>
                {getDropZoneContent()}
            </div>
        </div>
    )

}

const mapDispatchToProps = {
    updateActiveImageIndex,
    addImagesData,
};

export default connect(null, mapDispatchToProps)(ImageDropZone)