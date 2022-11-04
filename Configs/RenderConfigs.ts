import { GeneralConfigs } from "./GeneralConfigs";
import { ISize } from "../Types/Interfaces";


export class RenderConfigs {
    public readonly lineThickness: number = 5;
    public readonly lineActiveColor: string = GeneralConfigs.PRIMARY_COLOR;  // moved to lineconfig
    public readonly lineInactiveColor: string = GeneralConfigs.SECONDARY_COLOR; // moved to lineconfig

    public readonly crossHairPadding: number = 15;
    public readonly crossHairLineColor: string = GeneralConfigs.SECONDARY_COLOR;

    public readonly activeAnchorColor: string = GeneralConfigs.THIRD_COLOR;
    public readonly inactiveAnchorColor: string = GeneralConfigs.FOURTH_COLOR;

    public readonly anchorSize: ISize = {
        width: 6,
        height: 6
    };

    public readonly anchorHoverSize: ISize = {
        width: 16,
        height: 16
    };
    public readonly suggestedAnchorDetectionSize: ISize = {
        width: 16,
        height: 16
    };



};