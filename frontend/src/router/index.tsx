import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GoogleLogin from '../pages/GoogleLogin'
import AuthRoute from '../guards/AuthRoute'
import Home from '../pages/Home'
import Layout from '../components/Layout'
import RankingBoard from '../pages/RankingBoard'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<GoogleLogin />} />
                <Route path="/" element={
                    <AuthRoute>
                        <Layout>
                            <Home />
                        </Layout>
                    </AuthRoute>
                } />
                <Route path="/ranking" element={
                    <AuthRoute>
                        <Layout>
                            <RankingBoard />
                        </Layout>
                    </AuthRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}