import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ToastProvider, useToasts } from 'react-toast-notifications';
//import 'semantic-ui-css/semantic.min.css'


ReactDOM.render(
  <ToastProvider>
 
    <App />
    </ToastProvider>,

  document.getElementById('root')
);


