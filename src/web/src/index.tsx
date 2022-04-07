import { Store } from '@animus-bi/redxs';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.scss';

import { config } from './config';

if (process.env.REACT_APP_STAGE !== 'prd') {
  Store.Logger.enableLogging();
}

const entryPointComponent = <App />;

ReactDOM.render(
  // <React.StrictMode>
    entryPointComponent
  // </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
