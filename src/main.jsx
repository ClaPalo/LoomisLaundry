import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import AuthProvider from './context/AuthProvider'
import { NextUIProvider } from '@nextui-org/react'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <NextUIProvider>
            <HashRouter basename="LoomisLaundry">
                <AuthProvider>
                    <main className="dark">
                        <App />
                    </main>
                </AuthProvider>
            </HashRouter>
        </NextUIProvider>
    </React.StrictMode>
)
