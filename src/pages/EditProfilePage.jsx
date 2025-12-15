import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Narek",
    phone: "+4455200136",
    email: "narek101@gmail.com",
    companyName: "Snow Tex",
    vatNumber: "5200136",
    street: "Belgium",
    number: "1506",
    city: "Antwerp Province, Belgium",
    postalCode: "303",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/account?page=profile");
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/account?page=profile")}
        className="flex items-center gap-2 text-gray-700 mb-8 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Person Section */}
        <section className="pb-8 border-b bg-[#F9F9F9] p-6 rounded-lg border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Contact Person</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Company Details Section */}
        <section className="pb-8 border-b bg-[#F9F9F9] p-6 rounded-lg border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Company Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Company Name
              </label>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                VAT Number
              </label>
              <Input
                type="text"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleChange}
                placeholder="Enter your VAT number"
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Business Address Section */}
        <section className="pb-8 border-b bg-[#F9F9F9] p-6 rounded-lg border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Business Address</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Street
                </label>
                <Input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Enter your street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Number
                </label>
                <Input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Enter your number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Postal Code
                </label>
                <Input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Enter your postal code"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Account Setup Section */}
        <section className="pb-8 bg-[#F9F9F9] p-6 rounded-lg border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Account Setup</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pr-10"
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
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="border-primary text-primary hover:bg-green-50 bg-transparent"
            onClick={() => navigate("/account?page=profile")}
          >
            cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-green-400 text-white"
          >
            Request Account
          </Button>
        </div>
      </form>
    </main>
  );
}
