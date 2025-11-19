import React from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import "./auth-layout.css"
import "./SignupPage.css"
import "./styleguide.css"
import logoClear from "@/assets/Logo (clear).png"
import people from "@/assets/People.png"

export default function SignupPage() {
  const [role, setRole] = React.useState("")
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!role) {
      setError("Please select whether you are an organizer or a volunteer.")
      return
    }

    const form = e.target
    const firstName = form.firstName.value
    const lastName = form.lastName.value
    const email = form.email.value
    const password = form.password.value

    try {
      setIsLoading(true)

      await api.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        role,
      })

      setSuccess("Account created! You can now sign in.")
      // Small delay so they see the message, then go back to sign-in
      setTimeout(() => navigate("/"), 800)
    } catch (err) {
      console.error(err)
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page auth-page--signup">
      <div className="auth-visual">
        <img className="auth-logo" alt="Come-Unity logo" src={logoClear} />

        <div className="auth-visual__copy">
          <h1 className="auth-visual__headline">
            Become a Member
            <span>Within the Community</span>
          </h1>
        </div>

        <img className="auth-visual__image" alt="Community illustration" src={people} />
      </div>

      <div className="auth-panel">
        <div className="auth-panel__card">
          <h2 className="auth-panel__title">Create Account</h2>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <form className="auth-form auth-form--signup" onSubmit={handleSubmit}>
            <div className="auth-form__grid">
              <label className="auth-field">
                <span>FIRST NAME</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  required
                />
              </label>

              <label className="auth-field">
                <span>LAST NAME</span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  required
                />
              </label>
            </div>

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
                placeholder="Create a password"
                required
              />
            </label>

            <fieldset className="auth-role">
              <legend>Select your role</legend>
              <div className="auth-role__options">
                <label className="auth-role__option">
                  <input
                    type="radio"
                    name="role"
                    value="organizer"
                    checked={role === "organizer"}
                    onChange={(event) => setRole(event.target.value)}
                  />
                  <span>Organizer</span>
                </label>

                <label className="auth-role__option">
                  <input
                    type="radio"
                    name="role"
                    value="volunteer"
                    checked={role === "volunteer"}
                    onChange={(event) => setRole(event.target.value)}
                  />
                  <span>Volunteer</span>
                </label>
              </div>
            </fieldset>

            <button
              type="submit"
              className="auth-button"
              disabled={!role || isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            <p className="auth-note">
              Already have an account?{" "}
              <a className="auth-link" href="/">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
