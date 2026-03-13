import './index.scss'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';
// import '@mantine/charts/styles.css';
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import Theme from "@/theme/Theme.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Theme>
            <App/>
        </Theme>
    </BrowserRouter>
)