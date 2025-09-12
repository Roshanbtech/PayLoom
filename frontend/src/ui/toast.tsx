// src/ui/toast.tsx
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export { toast };


export function ToastHost() {
return (
<ToastContainer
position="top-right"
autoClose={2600}
newestOnTop
closeOnClick
pauseOnHover
draggable
theme="dark"
transition={Slide}
toastStyle={{ background: '#0f1a1c', color: '#e6f4ea', border: '1px solid #122a1e' }}
/>
);
}