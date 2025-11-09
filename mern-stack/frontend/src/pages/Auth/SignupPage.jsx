import React from "react"
import "./auth-layout.css"
import "./SignupPage.css"
import "./styleguide.css"
import logoClear from "@/assets/Logo (clear).png"
import people from "@/assets/People.png"

export default function SignupPage() {
  const [role, setRole] = React.useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!role) {
      alert("Please select whether you are an organizer or a volunteer.")
      return
    }
    // TODO: replace with real sign-up logic
    alert(`Sign-up submitted as ${role}`)
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

          <form className="auth-form auth-form--signup" onSubmit={handleSubmit}>
            <div className="auth-form__grid">
              <label className="auth-field">
                <span>FIRST NAME</span>
                <input type="text" name="firstName" placeholder="First name" required />
              </label>

              <label className="auth-field">
                <span>LAST NAME</span>
                <input type="text" name="lastName" placeholder="Last name" required />
              </label>
            </div>

            <label className="auth-field">
              <span>EMAIL</span>
              <input type="email" name="email" placeholder="Enter your email" required />
            </label>

            <label className="auth-field">
              <span>PASSWORD</span>
              <input type="password" name="password" placeholder="Create a password" required />
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

            <button type="submit" className="auth-button" disabled={!role}>
              Create Account
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
