import { Action, SiteActionTypes } from "./types";

export function setStatusBar(Open: boolean, Type: string, Message: string): SiteActionTypes {
    return {
        type: Action.UPDATE_STATUS_BAR,
        statusBar: {
            Open: Open,
            Type: Type,
            Message: Message,
        },
    }
}


export function setSearchBarFn(searchBarFn): SiteActionTypes {
    return {
        type: Action.UPDATE_SEARCH_BAR_FUNCTION,
        searchBarFn: searchBarFn
    }
}
