import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Provider} from 'react-redux'
// import App from './App.jsx'
import { store } from './redux/store.js'
import ScrollLinked from './component/ScrollAnimation'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

let persistor = persistStore(store)


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ScrollLinked/>
    {/* <App/> */}
    </PersistGate>
  </Provider>
)
