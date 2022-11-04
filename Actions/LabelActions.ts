import { filter } from 'lodash';
import { ImageDataType, LabelPoint, LabelsSelector, LabelLine, LabelRect } from '../Store/Label';
import { LabelTypes } from '../Types';
import { store } from '..';
import { updateImageDataById } from '../Store/Label/ActionCreators';
import { LabelCircle, LabelPolygon, LabelArrow, LabelCuboid, LabelFreehand, LabelPaintBrush, LabelSegmentation } from '../Store/Label/types';

export class LabelActions {
    public static deleteActiveLabel(): void {
        const activeImageData: ImageDataType | null = LabelsSelector.getActiveImageData();
        const activeLabelId: string | null = LabelsSelector.getActiveLabelId();
        if (activeImageData && activeLabelId) {
            LabelActions.deleteLabelOfActiveTypeById(activeImageData.id, activeLabelId);
        }

    }
    static deleteLabelOfActiveTypeById(imageId: string, LabelId: string): void {
        switch (LabelsSelector.getActiveLabelType()) {
            case LabelTypes.POINT: {
                LabelActions.deletePointLabelById(imageId, LabelId);
                break;
            }
            default: {
                console.error("Unknown Label Type encountered");
                console.error(LabelsSelector.getActiveLabelType());
                break;
            }
        }
    }
    static hideAnyLabelById(imageId: any, LabelId: string) {
        const imageData: ImageDataType | null = LabelsSelector.getImageDataById(imageId);
        if (imageData) {
            let idxCircle = imageData.labelCircles.findIndex(x => x.id === LabelId)
            let idxPoint = imageData.labelPoints.findIndex(x => x.id === LabelId)
            let idxRect = imageData.labelRects.findIndex(x => x.id === LabelId)
            let idxLine = imageData.labelLines.findIndex(x => x.id === LabelId)
            let idxPolygon = imageData.labelPolygon.findIndex(x => x.id === LabelId)
            let idxArrow = imageData.labelArrow.findIndex(x => x.id === LabelId)
            let idxFreehand = imageData.labelFreeHand.findIndex(x => x.id === LabelId)
            let idxPaintBrush = imageData.labelPaintBrush.findIndex(x => x.id === LabelId)
            let idxSegmentation = imageData.labelSegmentation.findIndex(x => x.id === LabelId)

            if (idxSegmentation > -1) {
                imageData.labelSegmentation[idxSegmentation].isHidden = !imageData.labelSegmentation[idxSegmentation].isHidden
            }
            if (idxCircle > -1) {
                imageData.labelCircles[idxCircle].isHidden = !imageData.labelCircles[idxCircle].isHidden
            }
            if (idxPoint > -1) {
                imageData.labelPoints[idxPoint].isHidden = !imageData.labelPoints[idxPoint].isHidden
            }
            if (idxRect > -1) {
                imageData.labelRects[idxRect].isHidden = !imageData.labelRects[idxRect].isHidden
            }
            if (idxLine > -1) {
                imageData.labelLines[idxLine].isHidden = !imageData.labelLines[idxLine].isHidden
            }
            if (idxPolygon > -1) {
                imageData.labelPolygon[idxPolygon].isHidden = !imageData.labelPolygon[idxPolygon].isHidden
            }
            if (idxArrow > -1) {
                imageData.labelArrow[idxArrow].isHidden = !imageData.labelArrow[idxArrow].isHidden
            }
            if (idxFreehand > -1) {
                imageData.labelFreeHand[idxFreehand].isHidden = !imageData.labelFreeHand[idxFreehand].isHidden
            }

            if (idxPaintBrush > -1) {
                imageData.labelPaintBrush[idxPaintBrush].isHidden = !imageData.labelPaintBrush[idxPaintBrush].isHidden
            }




            const newImageData: ImageDataType = {
                ...imageData,
                labelPoints: imageData.labelPoints,
                labelLines: imageData.labelLines,
                labelRects: imageData.labelRects,
                labelCircles: imageData.labelCircles,
                labelPolygon: imageData.labelPolygon,
                labelCuboid: imageData.labelCuboid,
                labelFreeHand: imageData.labelFreeHand,
                labelArrow: imageData.labelArrow,

            }
            store.dispatch(updateImageDataById(imageId, newImageData));
        }
    }

    static setAnnotation(imageId: any, LabelId: string, Annotation: string | null) {
        const imageData: ImageDataType | null = LabelsSelector.getImageDataById(imageId);
        if (imageData) {
            let idxCircle = imageData.labelCircles.findIndex(x => x.id === LabelId)
            let idxPoint = imageData.labelPoints.findIndex(x => x.id === LabelId)
            let idxRect = imageData.labelRects.findIndex(x => x.id === LabelId)
            let idxLine = imageData.labelLines.findIndex(x => x.id === LabelId)
            let idxPolygon = imageData.labelPolygon.findIndex(x => x.id === LabelId)
            let idxArrow = imageData.labelArrow.findIndex(x => x.id === LabelId)
            let idxFreehand = imageData.labelFreeHand.findIndex(x => x.id === LabelId)
            let idxPaintBrush = imageData.labelPaintBrush.findIndex(x => x.id === LabelId)
            if (idxCircle > -1) {
                imageData.labelCircles[idxCircle].annotation = Annotation;
            }
            if (idxPoint > -1) {
                imageData.labelPoints[idxPoint].annotation = Annotation;
            }
            if (idxRect > -1) {
                imageData.labelRects[idxRect].annotation = Annotation;
            }
            if (idxLine > -1) {
                imageData.labelLines[idxLine].annotation = Annotation;
            }
            if (idxPolygon > -1) {
                imageData.labelPolygon[idxPolygon].annotation = Annotation;
            }
            if (idxArrow > -1) {
                imageData.labelArrow[idxArrow].annotation = Annotation;
            }
            if (idxFreehand > -1) {
                imageData.labelFreeHand[idxFreehand].annotation = Annotation;
            }

            if (idxPaintBrush > -1) {
                imageData.labelPaintBrush[idxPaintBrush].annotation = Annotation;
            }




            const newImageData: ImageDataType = {
                ...imageData,
                labelPoints: imageData.labelPoints,
                labelLines: imageData.labelLines,
                labelRects: imageData.labelRects,
                labelCircles: imageData.labelCircles,
                labelPolygon: imageData.labelPolygon,
                labelCuboid: imageData.labelCuboid,
                labelFreeHand: imageData.labelFreeHand,
                labelArrow: imageData.labelArrow,

            }
            store.dispatch(updateImageDataById(imageId, newImageData));
        }
    }

    static setAnnotationName(imageId: any, LabelId: string, Annotation: string | undefined) {
        const imageData: ImageDataType | null = LabelsSelector.getImageDataById(imageId);
        if (imageData) {
            let idxCircle = imageData.labelCircles.findIndex(x => x.id === LabelId)
            let idxPoint = imageData.labelPoints.findIndex(x => x.id === LabelId)
            let idxRect = imageData.labelRects.findIndex(x => x.id === LabelId)
            let idxLine = imageData.labelLines.findIndex(x => x.id === LabelId)
            let idxPolygon = imageData.labelPolygon.findIndex(x => x.id === LabelId)
            let idxArrow = imageData.labelArrow.findIndex(x => x.id === LabelId)
            let idxFreehand = imageData.labelFreeHand.findIndex(x => x.id === LabelId)
            let idxPaintBrush = imageData.labelPaintBrush.findIndex(x => x.id === LabelId)


            if (idxCircle > -1) {
                imageData.labelCircles[idxCircle].annotationName = Annotation;
            }
            if (idxPoint > -1) {
                imageData.labelPoints[idxPoint].annotationName = Annotation;
            }
            if (idxRect > -1) {
                imageData.labelRects[idxRect].annotationName = Annotation;
            }
            if (idxLine > -1) {
                imageData.labelLines[idxLine].annotationName = Annotation;
            }
            if (idxPolygon > -1) {
                imageData.labelPolygon[idxPolygon].annotationName = Annotation;
            }
            if (idxArrow > -1) {
                imageData.labelArrow[idxArrow].annotationName = Annotation;
            }
            if (idxFreehand > -1) {
                imageData.labelFreeHand[idxFreehand].annotationName = Annotation;
            }

            if (idxPaintBrush > -1) {
                imageData.labelPaintBrush[idxPaintBrush].annotationName = Annotation;
            }




            const newImageData: ImageDataType = {
                ...imageData,
                labelPoints: imageData.labelPoints,
                labelLines: imageData.labelLines,
                labelRects: imageData.labelRects,
                labelCircles: imageData.labelCircles,
                labelPolygon: imageData.labelPolygon,
                labelCuboid: imageData.labelCuboid,
                labelFreeHand: imageData.labelFreeHand,
                labelArrow: imageData.labelArrow,

            }
            store.dispatch(updateImageDataById(imageId, newImageData));
        }
    }


    static deleteAnyLabelById(imageId: any, LabelId: string) {
        const imageData: ImageDataType | null = LabelsSelector.getImageDataById(imageId);
        if (imageData) {
            const newImageData: ImageDataType = {
                ...imageData,
                labelPoints: filter(imageData.labelPoints, (currentLabel: LabelPoint) => {
                    return (currentLabel.id !== LabelId)
                }),
                labelLines: filter(imageData.labelLines, (currentLabel: LabelLine) => {
                    return (currentLabel.id !== LabelId)
                }),
                labelRects: filter(imageData.labelRects, (currentLabel: LabelRect) => {
                    return (currentLabel.id !== LabelId)
                }),
                labelCircles: filter(imageData.labelCircles, (currentLabel: LabelCircle) => {
                    return (currentLabel.id !== LabelId)
                }),
                labelPolygon: filter(imageData.labelPolygon, (currentLabel: LabelPolygon) => {
                    return (currentLabel.id !== LabelId)
                }),
                labelCuboid: filter(imageData.labelCuboid, (currentLabel: LabelCuboid) => {
                    return (currentLabel.id !== LabelId)
                }),
                labelFreeHand: filter(imageData.labelFreeHand, (currentLabel: LabelFreehand) => {
                    return (currentLabel.id !== LabelId)
                }),
                labelArrow: filter(imageData.labelArrow, (currentLabel: LabelArrow) => {
                    return (currentLabel.id !== LabelId)
                }),

                labelPaintBrush: filter(imageData.labelPaintBrush, (currentLabel: LabelPaintBrush) => {
                    return (currentLabel.id !== LabelId)
                }),
                labelSegmentation: filter(imageData.labelSegmentation, (currentLabel: LabelSegmentation) => {
                    return (currentLabel.id !== LabelId)
                }),

            }
            store.dispatch(updateImageDataById(imageId, newImageData));
        }
    }

    static deletePointLabelById(imageId: any, LabelId: string) {
        const imageData: ImageDataType | null = LabelsSelector.getImageDataById(imageId);
        if (imageData) {
            const newImageData: ImageDataType = {
                ...imageData,
                labelPoints: filter(imageData.labelPoints, (currentLabel: LabelPoint) => {
                    return (currentLabel.id !== LabelId)
                })
            }
            store.dispatch(updateImageDataById(imageId, newImageData));
        }
    }

    static deleteLineLabelById(imageId: any, LabelId: string) {
        const imageData: ImageDataType | null = LabelsSelector.getImageDataById(imageId);
        if (imageData) {
            const newImageData: ImageDataType = {
                ...imageData,
                labelLines: filter(imageData.labelLines, (currentLabel: LabelLine) => {
                    return (currentLabel.id !== LabelId)
                })
            }
            store.dispatch(updateImageDataById(imageId, newImageData));
        }
    }

    static deletePolygonLabelById(imageId: any, LabelId: string) {
        const imageData: ImageDataType | null = LabelsSelector.getImageDataById(imageId);
        if (imageData) {
            const newImageData: ImageDataType = {
                ...imageData,
                labelPolygon: filter(imageData.labelPolygon, (currentLabel: LabelPolygon) => {
                    return (currentLabel.id !== LabelId)
                })
            }
            store.dispatch(updateImageDataById(imageId, newImageData));
        }
    }

    static deleteCircleLabelById(imageId: any, LabelId: string) {
        const imageData: ImageDataType | null = LabelsSelector.getImageDataById(imageId);
        if (imageData) {
            const newImageData: ImageDataType = {
                ...imageData,
                labelCircles: filter(imageData.labelCircles, (currentLabel: LabelCircle) => {
                    return (currentLabel.id !== LabelId)
                })
            }
            store.dispatch(updateImageDataById(imageId, newImageData));
        }
    }

    static deleteRectLabelById(imageId: any, LabelId: string) {
        const imageData: ImageDataType | null = LabelsSelector.getImageDataById(imageId);
        if (imageData) {
            const newImageData: ImageDataType = {
                ...imageData,
                labelRects: filter(imageData.labelRects, (currentLabel: LabelRect) => {
                    return (currentLabel.id !== LabelId)
                })
            }
            store.dispatch(updateImageDataById(imageId, newImageData));
        }
    }

}
