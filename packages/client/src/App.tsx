import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import router from './router/routes';
import './App.css';

function App() {
   return (
      <>
         <RouterProvider router={router} />
         <Toaster position="bottom-right" richColors />
      </>
   );
}

export default App;
