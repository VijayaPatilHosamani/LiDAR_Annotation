export class ColorUtils {
    public static getRandomRGBColor(): string {
        let color: string = (
            "rgb(" + Math.round(Math.random() * 255).toString() + ", " + Math.round(Math.random() * 255).toString() + ", " + Math.round(Math.random() * 255).toString() + ")"
        );
        return color;
    }


    public static hexToRGBColor(hex: string, alpha: number): string {
        // extract RGB values from hex
        const r: number = parseInt(hex.slice(1, 3), 16);
        const g: number = parseInt(hex.slice(3, 4), 16);
        const b: number = parseInt(hex.slice(5, 7), 16);

        if (alpha) { // if there is alpha
            return (
                "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"
            );
        }
        else {
            return (
                "rgb(" + r + ", " + g + ", " + b + ")"
            );
        }

    }
}