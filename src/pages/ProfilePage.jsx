import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2 } from "lucide-react";
import { DataTable } from "../components/Datatable";
import TermsPage from "./TermsPage";
import PrivacyPage from "./PrivacyPage";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const profileData = {
    fullName: "Narek",
    phone: "+4455200136",
    email: "narek101@gmail.com",
    companyName: "Snow Tex",
    vatNumber: "5200136",
    street: "Belgium",
    number: "1506",
    city: "Antwerp Province, Belgium",
    postalCode: "303",
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "orders", label: "Order History" },
    { id: "terms", label: "Terms & Condition" },
    { id: "privacy", label: "Privacy Policy" },
  ];

  const orders = [
    {
      orderDate: "2023-10-27",
      reference: "ORD-12345",
      totalItems: 5,
      deliveryDate: "2023-11-05",
      status: "Delivered",
    },
    {
      orderDate: "2023-11-15",
      reference: "ORD-67890",
      totalItems: 3,
      deliveryDate: "2023-11-20",
      status: "Shipped",
    },
    // Add more orders as needed
  ];

  const columns = [
    {
      accessorKey: "orderDate",
      header: "Order Date",
    },
    {
      accessorKey: "reference",
      header: "Reference",
    },
    {
      accessorKey: "totalItems",
      header: "Total Items",
    },
    {
      accessorKey: "deliveryDate",
      header: "Delivery Date",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-700 mb-8 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8">My Account</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-medium transition-colors ${
                activeTab === tab.id
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Details Card */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Company Details</h2>
              <button
                onClick={() => navigate("/edit-profile")}
                className="text-gray-600 hover:text-gray-900"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Company Name</p>
                <p className="font-medium">{profileData.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">VAT Number</p>
                <p className="font-medium">{profileData.vatNumber}</p>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{profileData.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{profileData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* Business Address Card */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Business Address</h2>
            <p className="text-gray-700">
              {profileData.street}, {profileData.city}, {profileData.postalCode}
            </p>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}

      {activeTab == "orders" && (
        <div className=" ">
          <DataTable columns={columns} data={orders} />
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
