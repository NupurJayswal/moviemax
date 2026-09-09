import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "../app/hooks";
import { login } from "../features/auth/authSlice";
import type { User } from "../types";

const DEMO_USER: User = {
  id: "user-1",
  name: "Nupur",
  email: "jayswalnupur@gmail.com",
  password: "123456",
};

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      setLoginError("Invalid email or password.");
      return;
    }

    dispatch(login(DEMO_USER));

    navigate("/movies");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600">MovieMax</h1>

        <p className="mt-2 text-gray-500">Login to book your movie tickets</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setLoginError("");
              }}
              placeholder="Enter your email"
              className={`w-full rounded-lg border p-3 outline-none focus:border-blue-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />

            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                  setLoginError("");
                }}
                placeholder="Enter your password"
                className={`w-full rounded-lg border p-3 pr-12 outline-none focus:border-blue-500 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={1.8} />
                ) : (
                  <Eye size={20} strokeWidth={1.8} />
                )}
              </button>
            </div>

            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          {loginError && <p className="text-sm text-red-500">{loginError}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm">
          <p className="font-semibold">Demo credentials</p>
          <p>Email: jayswalnupur@gmail.com</p>
          <p>Password: 123456</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
