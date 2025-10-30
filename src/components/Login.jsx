import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const { login, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [validated, setValidated] = useState(false);

  const handleLogin = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        await login(formData.email, formData.password);
        Swal.fire({
          title: "Success!",
          text: "You have been logged in successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/todo");
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Invalid credentials. Please try again.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
    setValidated(true);
  };

  const handleGoogleSignIn = async () => {
    await googleSignIn();
    navigate("/todo");
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login</p>
                    <form noValidate onSubmit={handleLogin} className={`mx-1 mx-md-4 needs-validation ${validated ? "was-validated" : ""}`}>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            required
                            type="email"
                            id="form3Example3c"
                            className="form-control"
                            placeholder="Your Email"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                          <div className="invalid-feedback">Please enter a valid email.</div>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            required
                            type="password"
                            id="form3Example4c"
                            className="form-control"
                            placeholder="Password"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          />
                          <div className="invalid-feedback">Please enter your password.</div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" className="btn btn-primary btn-lg">Login</button>
                      </div>
                    </form>
                    <p className="text-center">Or</p>
                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button onClick={handleGoogleSignIn} className="btn btn-danger btn-lg">
                        <i className="fab fa-google me-2"></i>Sign in with Google
                      </button>
                    </div>
                    <p className="text-center">
                      Don't have an account?{" "}
                      <span
                        onClick={() => navigate("/register")}
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                      >
                        Register
                      </span>
                    </p>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
