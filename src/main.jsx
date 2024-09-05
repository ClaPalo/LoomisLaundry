import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AuthProvider from './context/AuthProvider'
import { NextUIProvider } from '@nextui-org/react'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <NextUIProvider>
            <BrowserRouter>
                <AuthProvider>
                    <main className="dark">
                        <App />
                    </main>
                </AuthProvider>
            </BrowserRouter>
        </NextUIProvider>
    </React.StrictMode>
)
