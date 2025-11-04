import React from "react"
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
    <main className="signup-page">
      <div className="signup-left">
        <img className="signup-logo" alt="Come-Unity logo" src={logoClear} />

        <div className="signup-left-copy">
          <h1 className="signup-heading">
            Become a Member
            <span>Within the Community</span>
          </h1>
        </div>

        <img className="signup-people" alt="Community illustration" src={people} />
      </div>

      <div className="signup-right">
        <div className="signup-card">
          <h2 className="signup-title">Create Account</h2>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-name-row">
              <label className="signup-field">
                <span>FIRST NAME</span>
                <input type="text" name="firstName" placeholder="First name" required />
              </label>

              <label className="signup-field">
                <span>LAST NAME</span>
                <input type="text" name="lastName" placeholder="Last name" required />
              </label>
            </div>

            <label className="signup-field">
              <span>EMAIL</span>
              <input type="email" name="email" placeholder="Enter your email" required />
            </label>

            <label className="signup-field">
              <span>PASSWORD</span>
              <input type="password" name="password" placeholder="Create a password" required />
            </label>

            <fieldset className="signup-role">
              <div className="signup-radio-group">
                <label className="signup-option">
                  <input
                    type="radio"
                    name="role"
                    value="organizer"
                    checked={role === "organizer"}
                    onChange={(event) => setRole(event.target.value)}
                  />
                  <span>Are you an organizer?</span>
                </label>

                <label className="signup-option">
                  <input
                    type="radio"
                    name="role"
                    value="volunteer"
                    checked={role === "volunteer"}
                    onChange={(event) => setRole(event.target.value)}
                  />
                  <span>Are you a volunteer?</span>
                </label>
              </div>
            </fieldset>

            <button type="submit" className="signup-button" disabled={!role}>
              Create Account
            </button>

            <p className="signup-login-link">
              Already have an account? <a href="/">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
