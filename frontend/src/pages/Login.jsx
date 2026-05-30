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
      localStorage.setItem('user', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <div className="auth-header">
        <h3>Welcome Back</h3>
        <p>Sign in to continue cooking with ChefGPT</p>
      </div>

      <div className="auth-section">
        <div className="field">
          <label>Email address</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="your@email.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter your password" />
        </div>
      </div>

      <button className="auth-submit">Sign in</button>

      {error && <div className="auth-error">{error}</div>}

      <p className="auth-disclaimer">
        ChefGPT is an AI assistant and may occasionally provide inaccurate or incomplete information.
        Always use your best judgment when preparing food and consult reliable sources for dietary and safety concerns.
      </p>
    </form>
  )
}

export default Login
