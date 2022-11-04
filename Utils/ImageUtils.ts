import { ISize } from "../Types/Interfaces";

export class ImageUtils {
    public static getSize(image: HTMLImageElement): ISize | null {
        if (!image) return null;
        return {
            width: image.width,
            height: image.height
        }
    }
}