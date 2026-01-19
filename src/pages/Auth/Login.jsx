import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../Redux/services/authApi";
import { setCredentials } from "../../Redux/features/auth/authSlice";
import { useTranslation } from "react-i18next";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import LoginImage from "../../assets/images/login-user.png";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [login, { isLoading, error }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: null, token: result.auth_token }));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center">
        <img
          src={LoginImage}
          alt="Delivery person holding beverage crate"
          className="w-full h-[100vh] object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 py-12">
        {/* Logo */}
        <div className="mb-12 w-40 flex justify-center lg:justify-start">
          <img src="/logo.png" alt="" />
        </div>

        <form onSubmit={handleLogin} className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2">{t('loginPage.welcomeBack')}</h2>
          <p className="text-gray-600 mb-8">{t('loginPage.signIn')}</p>
          {error && (
            <p className="text-red-500 mb-4 text-sm">
              {error.data?.detail ||
                error.data?.non_field_errors?.[0] ||
                t('loginPage.loginFailed')}
            </p>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('loginPage.email')}
            </label>
            <Input
              type="email"
              placeholder={t('loginPage.emailPlaceholder')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`w-full ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('loginPage.password')}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t('loginPage.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center text-black gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onClick={(e) => {
                  setRememberMe(e.target.checked);
                }}
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            {/* <a href="#" className="text-sm text-gray-900 hover:underline">
              Forgot password?
            </a> */}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full border-primary text-primary hover:bg-green-50 bg-transparent"
              onClick={() => navigate("/auth/sign-up")}
            >
              {t('loginPage.signUp')}
            </Button>
            <Button
              onClick={handleLogin}
              type="submit"
              className="w-full bg-primary hover:bg-green-400 text-white"
            >
              {t('loginPage.login')}
            </Button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth/sign-up")}
              className="font-semibold text-gray-900 hover:underline"
            >
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
