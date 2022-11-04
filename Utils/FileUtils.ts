import { v1 as uuidv1 } from 'uuid';
import { ImageDataType } from '../Store/Label';


export class FileUtils {
    public static loadImage(fileData: File, onSuccess: (image: HTMLImageElement) => any, onFailure: () => any): any {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(fileData);
            const image = new Image();
            image.src = url;
            image.onload = () => {
                onSuccess(image);
                resolve(image);
            };
            image.onerror = () => {
                onFailure();
                reject();
            };
        })
    }

    public static mapFileDataToImageData(fileData: File): ImageDataType {
        return {
            id: uuidv1(),
            ImageURL : "",
            fileData: fileData,
            loaded: false,
            labelPoints: [],
            labelLines: [],
            labelRects: [],
            labelCircles: [],
            labelPolygon: [],
            labelArrow: [],
            labelFreeHand: [],
            labelCuboid: [],
            labelPaintBrush: [],
            labelSegmentation: []

        }
    }
}