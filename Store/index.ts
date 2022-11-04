import { combineReducers } from 'redux';
import { labelReducer } from "./Label"
import { EditorReducer } from './Editor';
import { UserReducer } from './User';
import { ProjectReducer } from './Project';
import { SiteReducer } from './Site';

export const rootReducer = combineReducers({
    labels: labelReducer,
    Editor: EditorReducer,
    User: UserReducer,
    Project: ProjectReducer,
    Site: SiteReducer
})

export type AppState = ReturnType<typeof rootReducer>