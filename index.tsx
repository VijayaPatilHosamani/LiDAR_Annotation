import React from "react";
import ReactDOM from 'react-dom';
import './index.scss';
import App from "./App";
import configureStore from "./configureStore";
import { Provider } from 'react-redux';
import AppInitializer from "./Initializer/AppInitializer";
import * as serviceWorker from './serviceWorker';


const rootElement = document.getElementById("root") || document.createElement("div"); // for testing purposes(no root)

export const store = configureStore();  // how App level state is handled

AppInitializer.init();

ReactDOM.render(
    (<Provider store={store} >
        <App />
    </Provider>)
    , rootElement
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();