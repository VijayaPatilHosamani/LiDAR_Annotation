export type ImageMap = { [s: string]: HTMLImageElement }

export class ImageManager {

    private static repository: ImageMap = {};

    public static store(id: string, image: HTMLImageElement): string {
        ImageManager.repository[id] = image;
        return id;
    }

    public static getById(id: string): HTMLImageElement | null {
        return ImageManager.repository[id];
    }
}