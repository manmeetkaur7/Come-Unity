import React from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import "./auth-layout.css"
import "./LoginPage.css"
import "./styleguide.css"
import logoClear from "@/assets/Logo (clear).png"
import people from "@/assets/People.png"

export default function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const form = e.target
    const email = form.email.value
    const password = form.password.value

    try {
      const data = await api.post("/api/auth/login", { email, password })
      // expected shape from backend: { token, user: { id, email, role } }

      // store full object so api.js can read token later
      localStorage.setItem("user", JSON.stringify(data))
      window.dispatchEvent(new Event("storage")); //fixes login redirect to wrong user page

      const role = data.user?.role

      if (role === "admin") {
        navigate("/dashboard/admin")
      } else if (role === "organizer") {
        navigate("/dashboard/organizer")
      } else {
        // volunteer or any other role
        navigate("/dashboard/volunteer")
      }
    } catch (err) {
      console.error(err)
      setError(err.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page auth-page--login">
      <div className="auth-visual">
        <img className="auth-logo" alt="Come-Unity logo" src={logoClear} />
        <div className="auth-visual__copy">
          <h1 className="auth-visual__headline">Welcome To Come-Unity</h1>
        </div>
        <img className="auth-visual__image" alt="People illustration" src={people} />
      </div>

      <div className="auth-panel">
        <div className="auth-panel__card">
          <h2 className="auth-panel__title">Sign In</h2>

          {error && <p className="auth-error">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>EMAIL</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </label>

            <label className="auth-field">
              <span>PASSWORD</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </label>

            <a className="auth-link" href="/signup">
              Create an account
            </a>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
