import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { curve, heroBackground } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles } from "./design/Hero";
import { authService } from "../services/authService";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const parallaxRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(formData.email, formData.password);
      } else {
        await authService.signup(
          formData.email,
          formData.username,
          formData.password
        );
      }
      navigate("/home");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <Section
      className="min-h-screen flex items-center justify-center !p-0"
      crosses
      crossesOffset="lg:translate-y-[0.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="relative w-full max-w-[450px] mx-auto">
            <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
              <div className="relative bg-n-8/90 rounded-[1rem] p-8">
                <h2 className="text-center text-2xl font-bold mb-6">
                  {isLogin ? "Login" : "Sign Up"}
                </h2>

                {error && (
                  <div className="mb-4 p-3 text-red-500 bg-red-500/10 rounded-lg">
                    {error}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-n-7/40 rounded-lg outline-none"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-n-7/40 rounded-lg outline-none"
                        placeholder="Choose a username"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-n-7/40 rounded-lg outline-none"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button className="w-full" disabled={loading}>
                    {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
                  </Button>

                  <p className="text-center mt-4">
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      onClick={handleToggle}
                      type="button"
                      className="text-primary-1 hover:text-primary-2 transition-colors"
                    >
                      {isLogin ? "Sign Up" : "Login"}
                    </button>
                  </p>
                </form>
              </div>
            </div>
            <div className="lg:translate-y-[-1.5rem]">
              <BackgroundCircles />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed -z-10 top-0 left-1/2 w-[234%] h-screen -translate-x-1/2">
        <img
          src={heroBackground}
          className="w-full h-full object-cover opacity-30"
          width={1440}
          height={1800}
          alt="hero"
        />
      </div>
    </Section>
  );
};

export default Login;
