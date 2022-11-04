import { EventTypes } from "../Types";

export class MouseEventUtils {
  public static getEventType(event: Event): EventTypes | null {
    if (!event) return null;

    switch (event.type) {
      case EventTypes.MOUSE_DOWN:
        return EventTypes.MOUSE_DOWN;
      case EventTypes.MOUSE_UP:
        return EventTypes.MOUSE_UP;
      case EventTypes.MOUSE_MOVE:
        return EventTypes.MOUSE_MOVE;
      case EventTypes.KEY_DOWN:
        return EventTypes.KEY_DOWN;
      default:
        return null;
    }
  }
}
