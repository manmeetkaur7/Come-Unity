import React from "react"
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
    <main className="login-page">
      <div className="login-left">
        <img className="logo-clear" alt="Come-Unity logo" src={logoClear} />
        <div className="login-left-copy">
          <h1 className="welcome-title">Welcome To Come-Unity</h1>
        </div>
        <img className="people" alt="People illustration" src={people} />
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2 className="login-subtitle">Sign In</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>EMAIL</span>
              <input type="email" placeholder="Enter your email" required />
            </label>

            <label className="field">
              <span>PASSWORD</span>
              <input type="password" placeholder="Enter your password" required />
            </label>

            <a className="create-account" href="/signup">
              Create an account
            </a>

            <button type="submit" className="sign-in-button">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
