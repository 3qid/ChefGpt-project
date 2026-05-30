import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [wantedFood, setWantedFood] = useState('')
  const [unwantedFood, setUnwantedFood] = useState('')
  const [allergies, setAllergies] = useState('')
  const { signup, error, isLoading } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(email, password, {
      name,
      wantedFood: wantedFood.split(',').map(s => s.trim()).filter(Boolean),
      unwantedFood: unwantedFood.split(',').map(s => s.trim()).filter(Boolean),
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
    })
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <div className="auth-header">
        <h3>Create Account</h3>
        <p>Join ChefGPT and start cooking smarter</p>
      </div>

      <div className="auth-section">
        <h4>Account</h4>
        <div className="field">
          <label>Email address</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="your@email.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Min. 6 characters" />
        </div>
        <div className="field">
          <label>Name</label>
          <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Your name" />
        </div>
      </div>

      <div className="auth-section">
        <h4>Food Preferences</h4>
        <p className="section-hint">Help the AI tailor recipes to your taste</p>
        <div className="field">
          <label>Favorite foods</label>
          <input type="text" onChange={(e) => setWantedFood(e.target.value)} value={wantedFood} placeholder="e.g. seafood, chicken, pasta" />
          <span className="field-hint">Separate items with commas</span>
        </div>
        <div className="field">
          <label>Disliked foods</label>
          <input type="text" onChange={(e) => setUnwantedFood(e.target.value)} value={unwantedFood} placeholder="e.g. mushrooms, fish" />
          <span className="field-hint">Separate items with commas</span>
        </div>
        <div className="field">
          <label>Allergies</label>
          <input type="text" onChange={(e) => setAllergies(e.target.value)} value={allergies} placeholder="e.g. peanuts, gluten, dairy" />
          <span className="field-hint">The AI will avoid these ingredients when possible</span>
        </div>
      </div>

      <button className="auth-submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </button>

      {error && <div className="auth-error">{error}</div>}

      <p className="auth-disclaimer">
        ChefGPT is an AI assistant and may occasionally provide inaccurate or incomplete information.
        Always use your best judgment when preparing food and consult reliable sources for dietary and safety concerns.
      </p>
    </form>
  )
}

export default Signup
