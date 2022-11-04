export class NumberUtils {
    public static keepValueWithinRange(value: number, min: number, max: number): number {
        if (value < min)
            return min;
        if (value > max)
            return max;

        return value;
    }

    public static isValueInRange(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }
}