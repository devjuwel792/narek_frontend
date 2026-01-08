import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/services/ordersApi";
import Swal from "sweetalert2";

export default function EditProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: profileData, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [successMessage, setSuccessMessage] = useState("");
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

  useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.name || "",
        phone: profileData.phone || "",
        email: profileData.email || "",
        //companyName: profileData.name || "",
        vatNumber: profileData.vat || "",
        street: profileData.street || "",
        number: profileData.streetnumber || "",
        city: profileData.city || "",
        postalCode: profileData.citycode || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: formData.fullName, // Using companyName as name
        vat: formData.vatNumber,
        email: formData.email,
        phone: formData.phone,

        street: formData.street,
        streetnumber: formData.number,
        city: formData.city,
        citycode: formData.postalCode,
        old_password: formData.password || undefined,
        new_password: formData.confirmPassword || undefined,
        // country_id: "BEL", // Default
        // language_id: "nld", // Default
        // currency_id: "EUR", // Default
      };
      await updateProfile(updateData).unwrap();
      Swal.fire({
        title: t("editProfile.successTitle"),
        text: t("editProfile.profileUpdated"),
        icon: "success",
        confirmButtonText: t("editProfile.ok"),
      }).then(() => {
        navigate("/account?page=profile");
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
      // Handle error, maybe show a toast or alert
    }
  };

  if (isLoading) return <div>{t("common.loading")}</div>;
  if (error) return <div>{t("editProfile.errorLoadingProfile")}</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/account?page=profile")}
        className="flex items-center gap-2 text-gray-700 mb-8 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t("common.back")}</span>
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8">{t("editProfile.title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Person Section */}
        <section className="pb-8 border-b bg-[#F9F9F9] p-6 rounded-lg border-gray-200">
          <h2 className="text-2xl font-bold mb-6">
            {t("editProfile.contactPerson")}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t("editProfile.fullName")}
              </label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t("editProfile.fullName")}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t("editProfile.phoneNumber")}
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("editProfile.phoneNumber")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t("editProfile.email")}
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("editProfile.email")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Company Details Section */}
        <section className="pb-8 border-b bg-[#F9F9F9] p-6 rounded-lg border-gray-200">
          <h2 className="text-2xl font-bold mb-6">
            {t("editProfile.companyDetails")}
          </h2>
          <div className="space-y-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('editProfile.companyName')}
              </label>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder={t('editProfile.companyName')}
                className="w-full"
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t("editProfile.vatNumber")}
              </label>
              <Input
                type="text"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleChange}
                placeholder={t("editProfile.vatNumber")}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Business Address Section */}
        <section className="pb-8 border-b bg-[#F9F9F9] p-6 rounded-lg border-gray-200">
          <h2 className="text-2xl font-bold mb-6">{t("editProfile.businessAddress")}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t("editProfile.street")}
                </label>
                <Input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder={t("editProfile.streetPlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t("editProfile.number")}
                </label>
                <Input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder={t("editProfile.numberPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t("editProfile.city")}
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t("editProfile.cityPlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t("editProfile.postalCode")}
                </label>
                <Input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder={t("editProfile.postalCodePlaceholder")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Account Setup Section */}
        <section className="pb-8 bg-[#F9F9F9] p-6 rounded-lg border-gray-200">
          <h2 className="text-2xl font-bold mb-6">{t('editProfile.accountSetup')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('editProfile.oldPassword')}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("editProfile.passwordPlaceholder")}
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
                {t('editProfile.newPassword')}
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("editProfile.passwordPlaceholder")}
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
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-green-400 text-white"
          >
            {t("editProfile.requestAccount")}
          </Button>
        </div>
      </form>
    </main>
  );
}
