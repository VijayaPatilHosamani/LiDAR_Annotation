/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEditor } from '../Types/Interfaces';
import { MouseEventUtils } from '../Utils';
import { EventTypes, LabelTypes } from "../Types"


export abstract class BaseRenderer {
    protected readonly canvas: HTMLCanvasElement;
    public labelType: LabelTypes;

    protected constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.labelType = LabelTypes.NONE;
    }

    public update(data: IEditor) {
        if (data.event) {

            switch (MouseEventUtils.getEventType(data.event)) {
                case EventTypes.KEY_DOWN: {
                    //   ;
                    this.keyPressHandler(data)
                    break;
                }
                case EventTypes.MOUSE_MOVE: {
                    this.mouseMoveHandler(data);
                    break;
                }
                case EventTypes.MOUSE_DOWN: {
                    this.mouseDownHandler(data);
                    break;
                }
                case EventTypes.MOUSE_UP: {
                    this.mouseUpHandler(data);
                    break;
                }
                default:
                    break;
            }
        }
    }


    protected abstract mouseMoveHandler(data: IEditor): void;
    protected abstract mouseDownHandler(data: IEditor): void;
    protected abstract mouseUpHandler(data: IEditor): void;
    protected abstract keyPressHandler(data: IEditor): void;



    abstract render(data: IEditor): void;

    abstract isInProgress(): boolean;

}