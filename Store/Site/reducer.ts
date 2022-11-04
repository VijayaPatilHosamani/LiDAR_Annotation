import { SiteState, SiteActionTypes, Action } from './types';


const initialState: SiteState = {
    statusBar: {
        Open: false,
        Type: "success",
        Message: "",
    },
    searchBarFn: null,
}

export function SiteReducer(
    state: SiteState = initialState,
    action: SiteActionTypes
): SiteState {
    switch (action.type) {
        case Action.UPDATE_STATUS_BAR: {
            return {
                ...state,
                statusBar: action.statusBar,
            }
        }
        case Action.UPDATE_SEARCH_BAR_FUNCTION: {
            return {
                ...state,
                searchBarFn: action.searchBarFn,
            }
        }
        default:
            return state;
    }
}