import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, sendOTP, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [useOTP, setUseOTP] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleLogin = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      await login(formData.email, formData.password);
      navigate("/todo");
    }
    setValidated(true);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    await sendOTP(phone);
    setOtpSent(true);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    await verifyOTP(phone, otp);
    navigate("/todo");
  };

  if (useOTP) {
    return (
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login with OTP</p>
                      {!otpSent ? (
                        <form onSubmit={handleSendOTP} className="mx-1 mx-md-4">
                          <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-phone fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="tel"
                                id="form3Example4c"
                                className="form-control"
                                placeholder="Phone Number"
                                onChange={(e) => setPhone(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button type="submit" className="btn btn-primary btn-lg">Send OTP</button>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyOTP} className="mx-1 mx-md-4">
                          <div className="d-flex flex-row align-items-center mb-4">
                            <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                            <div className="form-outline flex-fill mb-0">
                              <input
                                type="text"
                                id="form3Example4c"
                                className="form-control"
                                placeholder="OTP"
                                onChange={(e) => setOtp(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button type="submit" className="btn btn-primary btn-lg">Verify OTP</button>
                          </div>
                        </form>
                      )}
                      <p className="text-center">
                        <span
                          onClick={() => setUseOTP(false)}
                          className="text-primary"
                          style={{ cursor: "pointer" }}
                        >
                          Login with Email
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
                    <p className="text-center">
                      <span
                        onClick={() => setUseOTP(true)}
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                      >
                        Login with OTP
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
