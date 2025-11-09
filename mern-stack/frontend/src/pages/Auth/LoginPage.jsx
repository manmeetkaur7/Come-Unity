import React from "react"
import "./auth-layout.css"
import "./LoginPage.css"
import "./styleguide.css"
import logoClear from "@/assets/Logo (clear).png"
import people from "@/assets/People.png"

export default function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: handle real sign-in logic
    alert("Sign-in clicked")
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

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>EMAIL</span>
              <input type="email" placeholder="Enter your email" required />
            </label>

            <label className="auth-field">
              <span>PASSWORD</span>
              <input type="password" placeholder="Enter your password" required />
            </label>

            <a className="auth-link" href="/signup">
              Create an account
            </a>

            <button type="submit" className="auth-button">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
