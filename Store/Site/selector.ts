import { store } from "../.."
import { statusBar } from "./types";

export class SiteSelector {

    public static getStatusBarState(): statusBar {
        return store.getState().Site.statusBar;
    }

    public static getSearchBarFnState(): any {
        return store.getState().Site.searchBarFn;
    }

}
