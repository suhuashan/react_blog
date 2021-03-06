import React from 'react';
import { Provider } from 'react-redux';
import { renderRoutes } from "react-router-config";
import { BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from "./style/global.js";

import store from './store/index.js';
import routes from "./routes/index.js";
import './assets/iconfont/iconfont.css';
import './style/common.less';
import './style/reset.less';


function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <GlobalStyle/>
      {renderRoutes(routes)}
    </BrowserRouter>
  </Provider>
  );
}

export default App;
