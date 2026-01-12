"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterUserMutation } from "@/Redux/services/authApi";
import Swal from "sweetalert2";

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    companyName: "",
    vatNumber: "",
    street: "",
    number: "",
    city: "",
    postalCode: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const body = {
      name: formData.companyName,
      street: formData.street,
      streetnumber: formData.number,
      citycode: formData.postalCode,
      city: formData.city,
      vat: formData.vatNumber,
      phone: formData.phone,
      gsm: "",
      email: formData.email,
      website: "",
      vat_exception: "03",
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    try {
      await registerUser(body).unwrap();
      Swal.fire({
        title: "Success!",
        text: "Your account has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      Swal.fire({
        title: "Registration Failed",
        text:
          err.data?.email[0] ||
          err.data?.details ||
          "Registration failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to login */}
        <button
          onClick={() => navigate("/auth/login")}
          className="flex items-center font-bold gap-2 text-gray-700 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('signUpPage.backToLogin')}
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div>
            <img src="/logo.png" alt="Logo" className="mx-auto mb-5" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{t('signUpPage.registration')}</h2>
          <p className="text-gray-600">
            {t('signUpPage.createAccount')}
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Person Section */}
          <div className="bg-card border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-6">{t('signUpPage.contactPerson')}</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('signUpPage.fullName')}
              </label>
              <Input
                type="text"
                name="fullName"
                placeholder={t('signUpPage.fullNamePlaceholder')}
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? "border-red-500" : ""}
                required
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('signUpPage.phoneNumber')}
                </label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder={t('signUpPage.phonePlaceholder')}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('signUpPage.email')}
                </label>
                <Input
                  type="email"
                  name="email"
                   pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
                  placeholder={t('signUpPage.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="bg-card border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-6">{t('signUpPage.companyDetails')}</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('signUpPage.companyName')}
              </label>
              <Input
                type="text"
                name="companyName"
                placeholder={t('signUpPage.companyNamePlaceholder')}
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? "border-red-500" : ""}
                required
              />
              {errors.companyName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('signUpPage.vatNumber')}
              </label>
              <Input
                type="text"
                name="vatNumber"
                placeholder={t('signUpPage.vatPlaceholder')}
                value={formData.vatNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Business Address Section */}
          <div className="bg-card border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-6">{t('signUpPage.businessAddress')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('signUpPage.street')}
                </label>
                <Input
                  type="text"
                  name="street"
                  placeholder={t('signUpPage.streetPlaceholder')}
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('signUpPage.streetNumber')}
                </label>
                <Input
                  type="text"
                  name="number"
                  placeholder={t('signUpPage.streetNumberPlaceholder')}
                  value={formData.number}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('signUpPage.city')}
                </label>
                <Input
                  type="text"
                  name="city"
                  placeholder={t('signUpPage.cityPlaceholder')}
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('signUpPage.postalCode')}
                </label>
                <Input
                  type="text"
                  name="postalCode"
                  placeholder={t('signUpPage.postalCodePlaceholder')}
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Account Setup Section */}
          <div className="bg-card border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-6">{t('signUpPage.accountSetup')}</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('signUpPage.password')}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
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
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('signUpPage.confirmPassword')}
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-primary text-primary hover:bg-green-50 bg-transparent"
              onClick={() => navigate("/")}
            >
              {t('signUpPage.cancel')}
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-green-400 text-white"
              disabled={isLoading}
            >
              {isLoading ? t('signUpPage.registering') : t('signUpPage.requestAccount')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
