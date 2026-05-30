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
      <h3>Sign Up</h3>

      <label>Email address:</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />

      <label>Password:</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />

      <label>Name:</label>
      <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Your name" />

      <label>Favorite foods:</label>
      <input type="text" onChange={(e) => setWantedFood(e.target.value)} value={wantedFood} placeholder="e.g. chicken, rice, pasta" />
      <small style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Separate with commas</small>

      <label>Disliked foods:</label>
      <input type="text" onChange={(e) => setUnwantedFood(e.target.value)} value={unwantedFood} placeholder="e.g. mushrooms, fish" />
      <small style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Separate with commas</small>

      <label>Allergies:</label>
      <input type="text" onChange={(e) => setAllergies(e.target.value)} value={allergies} placeholder="e.g. peanuts, gluten, dairy" />
      <small style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Separate with commas — the AI will avoid these ingredients</small>

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error" style={{color: "red", marginTop: "10px"}}>{error}</div>}
    </form>
  )
}

export default Signup
