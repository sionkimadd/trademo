import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GoogleLogin from '../pages/GoogleLogin'
import AuthRoute from '../guards/AuthRoute'
import Home from '../pages/Home'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<GoogleLogin />} />
                <Route path="/" element={<AuthRoute><Home /></AuthRoute>} />
            </Routes>
        </BrowserRouter>
    )
}