
export type SiteState = {
    statusBar: statusBar,
    searchBarFn: any,
};

export type statusBar = {
    Open: boolean,
    Type: string,
    Message: string,
};



export enum Action {
    UPDATE_STATUS_BAR = "UPDATE_STATUS_BAR",
    UPDATE_SEARCH_BAR_FUNCTION = "UPDATE_SEARCH_BAR_FUNCTION",
}

interface UpdateStatusBar {
    type: typeof Action.UPDATE_STATUS_BAR;
    statusBar: statusBar;
}

interface UpdateSearchBarFn {
    type: typeof Action.UPDATE_SEARCH_BAR_FUNCTION;
    searchBarFn: any;
}



export type SiteActionTypes =
    | UpdateStatusBar
    | UpdateSearchBarFn