// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext'; // استدعاء الـ Hook لقراءة حالة المستخدم

// استيراد الصفحات والمكونات
import Home from './pages/Home'; 
import Navbar from './components/Navbar';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 

function App() {
  const { user } = useAuthContext(); // جلب متغير الـ user من الـ Context

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            {/* إذا كان المستخدم مسجل دخول، اعرض صفحة Home، وإلا حوّله لصفحة الـ login */}
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            
            {/* إذا كان المستخدم ليس مسجل دخول، اعرض صفحة Login، وإذا كان مسجلاً حوّله للرئيسية */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            
            {/* إذا كان المستخدم ليس مسجل دخول، اعرض صفحة Signup، وإذا كان مسجلاً حوّله للرئيسية */}
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;