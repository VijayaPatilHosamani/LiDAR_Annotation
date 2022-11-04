import { IEditor } from "../Types/Interfaces";
import { MouseEventUtils } from "../Utils";
import { EventTypes } from "../Types";

export class canvasCursorHandler {

    public update(data: IEditor): void {
        if (data.event) {
            switch (MouseEventUtils.getEventType(data.event)) {

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

                default: {
                    break;
                }
            }
        }
    }

    private mouseDownHandler(_data: IEditor): void {
        // to work with cursors
    }

    private mouseMoveHandler(_data: IEditor): void {
        // to work with cursors
    }

    private mouseUpHandler(_data: IEditor): void {
        // to work with cursors
    }
}