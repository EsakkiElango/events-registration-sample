import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import General from './pages/General';
import RegisterList from './pages/RegisterList';
import RegistrationForm from './pages/RegistrationForm';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
export default function App(){

// const [bgUrl, setBgUrl] = React.useState('');
//   const googleImageUrl = "https://drive.google.com/drive-viewer/AKGpihaIU3cqkRS34pwEqXB_6yQ9UdZXD3tvjRNKwWhEZlbUgoyat2oWbRz-S00YvCl9GTE2AFbZrNqEiaugmmLt2mZfEX5LuznDUw=w1920-h1080-rw-v1?auditContext=forDisplay";

//   React.useEffect(() => {
//     // Fetch the image to bypass NotSameSite/CORP issues
//     fetch(googleImageUrl, {
//       referrerPolicy: "no-referrer" // Key part to avoid Google's block
//     })
//       .then((res) => res.blob())
//       .then((blob) => {
//         // Create a local URL for the blob
//         const objectURL = URL.createObjectURL(blob);
//         setBgUrl(objectURL);
//       })
//       .catch((err) => console.error("Failed to load background:", err));

//     // Cleanup memory when component unmounts
//     return () => {
//       if (bgUrl) URL.revokeObjectURL(bgUrl);
//     };
//   }, []);
  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${'https://uploadedimages.blob.core.windows.net/uploadedimages/bg_image_2.png'})`,
    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <Navbar />
      <div className="w-[92%] md:w-[85%] max-w-7xl mx-auto" >
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<ProtectedRoute><General/></ProtectedRoute>} />
          <Route path="/registers" element={<ProtectedRoute><RegisterList/></ProtectedRoute>} />
          <Route path="/registers/new" element={<ProtectedRoute><RegistrationForm/></ProtectedRoute>} />
          <Route path="/registers/:id/edit" element={<ProtectedRoute><RegistrationForm/></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
