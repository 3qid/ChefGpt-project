import { useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { dispatch } = useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // 1. إرسال طلب تسجيل الدخول للـ Backend API
    const response = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }

    if (response.ok) {
      // 2. حفظ البيانات الكاملة (التي تحتوي على الـ token والـ email) في المتصفح
      localStorage.setItem('user', JSON.stringify(json))

      // 3. تحديث الـ Context بالـ Object الكامل القادم من السيرفر 🔑
      dispatch({ type: 'LOGIN', payload: json })
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log In</h3>
      <label>Email address:</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      
      <label>Password:</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />

      <button>Log in</button>
      {error && <div className="error" style={{color: "red", marginTop: "10px"}}>{error}</div>}
    </form>
  )
}

export default Login