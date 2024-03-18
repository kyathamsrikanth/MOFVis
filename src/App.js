import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import './App.css';
import Molecules from './pages/Molecules';
import Home from './pages/Home';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/molecule-vis',
    element: <Molecules />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
