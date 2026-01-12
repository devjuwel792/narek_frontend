import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Edit2 } from "lucide-react";
import { DataTable } from "../components/Datatable";
import TermsPage from "./TermsPage";
import PrivacyPage from "./PrivacyPage";
import { useGetOrdersQuery } from "@/Redux/services/ordersApi";
import { useGetProfileQuery } from "@/Redux/services/authApi";



export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const { t } = useTranslation();
  const { data: profileApiData, isLoading: profileLoading, error: profileError } = useGetProfileQuery();


  const profileData = profileApiData ? {
    fullName: profileApiData.name,
    phone: profileApiData.phone,
    email: profileApiData.email,
    companyName: profileApiData.name, // Assuming name is used for company name
    vatNumber: profileApiData.vat,
    street: profileApiData.street,
    number: profileApiData.streetnumber,
    city: profileApiData.city,
    postalCode: profileApiData.citycode,
  } : null;

  const tabs = [
    { id: "profile", label: t("profilePage.profile") },
    { id: "orders", label: t("profilePage.orderHistory") },
    { id: "terms", label: t("profilePage.termsAndCondition") },
    { id: "privacy", label: t("profilePage.privacyPolicy") },
  ];


  const { data: ordersData, isLoading, error } = useGetOrdersQuery();
  console.log("🚀 ~ ProfilePage ~ ordersData:", ordersData)

  const processedOrders = ordersData ? ordersData.map(order => ({
    orderDate: order.date,
    reference: order.number,
    totalItems: order.items.reduce((sum, item) => sum + parseInt(item.quantity), 0),
    deliveryDate: order.delivery_date,
    status: order.status,
  })) : [];

  const columns = [
    {
      accessorKey: "orderDate",
      header: t("profilePage.orderDate"),
    },
    {
      accessorKey: "reference",
      header: t("profilePage.reference"),
    },
    {
      accessorKey: "totalItems",
      header: t("profilePage.totalItems"),
    },
    {
      accessorKey: "deliveryDate",
      header: t("profilePage.deliveryDate"),
    },
    // {
    //   accessorKey: "status",
    //   header: t("profilePage.status"),
    // },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-700 mb-8 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t("common.back")}</span>
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8">{t("profilePage.myAccount")}</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-medium transition-colors ${activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab Content */}
      {activeTab === "profile" && (
        <div>
          {profileLoading ? (
            <div className="text-center py-8">{t("common.loading")}</div>
          ) : profileError ? (
            <div className="text-center py-8 text-red-500">{t("common.error")}</div>
          ) : profileData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Details Card */}
              <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">
                    {t("profilePage.companyDetails")}
                  </h2>
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("profilePage.companyName")}
                    </p>
                    <p className="font-medium">{profileData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("profilePage.vatNumber")}
                    </p>
                    <p className="font-medium">{profileData.vatNumber}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">
                  {t("profilePage.contactInformation")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("profilePage.fullName")}
                    </p>
                    <p className="font-medium">{profileData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("profilePage.phone")}
                    </p>
                    <p className="font-medium">{profileData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("profilePage.email")}
                    </p>
                    <p className="font-medium">{profileData.email}</p>
                  </div>
                </div>
              </div>

              {/* Business Address Card */}
              <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">
                  {t("profilePage.businessAddress")}
                </h2>
                <p className="text-gray-700">
                  {profileData.street} {profileData.number}, {profileData.city}, {profileData.postalCode}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Other tabs placeholder */}

      {activeTab == "orders" && (
        <div className=" ">
          {isLoading ? (
            <div className="text-center py-8">{t("common.loading")}</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{t("common.error")}</div>
          ) : (
            <DataTable columns={columns} data={processedOrders} />
          )}
        </div>
      )}
      {activeTab == "terms" && (
        <div className=" ">
          <TermsPage />
        </div>
      )}
      {activeTab == "privacy" && (
        <div className=" ">
          <PrivacyPage />
        </div>
      )}
    </main>
  );
}
