import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import useTheme from '../hooks/useTheme'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const { theme, toggleTheme } = useTheme()

  const handleClick = () => {
    logout()
  }

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <h1>ChefGPT</h1>
        </Link>
        <nav className="nav-links">
          {user && (
            <div className="user-controls">
              <span className="user-email">{user.name || user?.email?.split("@")[0] || ""}</span>
              <button onClick={toggleTheme} className="theme-btn" title="Toggle theme">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button onClick={handleClick} className="logout-btn">Log out</button>
            </div>
          )}

          {!user && (
            <div className="auth-links">
              <button onClick={toggleTheme} className="theme-btn" title="Toggle theme">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link signup-btn">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
