import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GoogleLogin from '../pages/GoogleLogin'
import AuthRoute from '../guards/AuthRoute'
import Home from '../pages/Home'
import Layout from '../components/Layout'
import RankingBoard from '../pages/RankingBoard'
import News from '../pages/News'

interface RouteConfig {
    path: string;
    element: React.ReactNode;
    requiresAuth?: boolean;
    withLayout?: boolean;
}

const routeConfigs: RouteConfig[] = [
    {
        path: '/login',
        element: <GoogleLogin />,
        requiresAuth: false,
        withLayout: false,
    },
    {
        path: '/',
        element: <Home />,
        requiresAuth: true,
        withLayout: true,
    },
    {
        path: '/ranking',
        element: <RankingBoard />,
        requiresAuth: true,
        withLayout: true,
    },
    {
        path: '/news',
        element: <News />,
        requiresAuth: true,
        withLayout: true,
    },
];

const renderRoute = (config: RouteConfig) => {
    let element = config.element;
    
    if (config.withLayout) {
        element = <Layout>{element}</Layout>;
    }
    
    if (config.requiresAuth) {
        element = <AuthRoute>{element}</AuthRoute>;
    }
    
    return element;
};

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                {routeConfigs.map((config) => (
                    <Route
                        key={config.path}
                        path={config.path}
                        element={renderRoute(config)}
                    />
                ))}
            </Routes>
        </BrowserRouter>
    )
}