import TextEditor from "@/components/custome/TextEditor";
import { useState, useEffect } from "react";
import {
  FiSettings,
  FiFileText,
  FiShield,
  FiBell,
  FiTrash2,
  FiTarget,
  FiInfo,
} from "react-icons/fi";
import {
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
  useGetCoreValuesQuery,
  useUpdateCoreValuesMutation,
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
} from "../../Redux/services/settingsApi";
import {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useChangePasswordMutation,
} from "../../Redux/services/authApi";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [accountSettings, setAccountSettings] = useState({
    dashboardName: "Admin User",
    email: "admin@cyberadmin.com",
    // role: "Administrator",
    // status: "Active",
  });
  const [privacyIsEdit, setPrivacyIsEdit] = useState(false);
  const [termIsEdit, setTermIsEdit] = useState(false);
  const [missionVisionIsEdit, setMissionVisionIsEdit] = useState(false);
  const [aboutUsIsEdit, setAboutUsIsEdit] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [termContent, setTermContent] = useState(
    `<div class="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-focused" lang="en" dir="ltr" role="textbox" aria-label="Rich Text Editor. Editing area: main. Press Alt+0 for help." contenteditable="true"><h2 data-placeholder="Type or paste your content here!">Clause 1</h2><p><span style="font-size:20px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.</span></p><h2>Clause 2</h2><div style="font-size:20px;"><span style="font-size:20px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.&nbsp;</span><br><br><span style="font-size:20px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.</span></div></div>`
  );
  const [privacyContent, setPrivacyContent] = useState(
    `<div class="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-focused" lang="en" dir="ltr" role="textbox" aria-label="Rich Text Editor. Editing area: main. Press Alt+0 for help." contenteditable="true"><div class="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-focused" lang="en" dir="ltr" role="textbox" aria-label="Rich Text Editor. Editing area: main. Press Alt+0 for help." contenteditable="true" data-placeholder="Type or paste your content here!"><div style="font-size:20px;" data-placeholder="Type or paste your content here!"><span style="font-size:20px;">Your privacy is important to us. It is Brainstorming's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</span></div><div style="font-size:20px;"><br data-cke-filler="true"></div><div style="font-size:20px;"><p><span style="font-size:20px;">We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</span></p><p><span style="font-size:20px;">We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</span></p></div></div></div>`
  );
  // const [missionVisionContent, setMissionVisionContent] = useState(``);
  const {
    data: aboutUsData,
    isLoading: aboutUsLoading,
    error: aboutUsError,
  } = useGetAboutUsQuery();
  const [updateAboutUs] = useUpdateAboutUsMutation();

  const {
    data: coreValuesData,
    isLoading: coreValuesLoading,
    error: coreValuesError,
  } = useGetCoreValuesQuery();
  const [updateCoreValues] = useUpdateCoreValuesMutation();

  const {
    data: termsData,
    isLoading: termsLoading,
    error: termsError,
  } = useGetTermsAndConditionsQuery();
  console.log("🚀 ~ Settings ~ termsData:", termsData);
  const [updateTermsAndConditions] = useUpdateTermsAndConditionsMutation();

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetCurrentUserQuery();
  const [updateCurrentUser] = useUpdateCurrentUserMutation();
  const [changePassword] = useChangePasswordMutation();

  const [aboutUsContent, setAboutUsContent] = useState(``);

  const [coreValuesContent, setCoreValuesContent] = useState(``);

  const [termsContent, setTermsContent] = useState(``);

  useEffect(() => {
    if (aboutUsData && aboutUsData.data.results.length > 0) {
      setAboutUsContent(aboutUsData.data.results[0].description);
    }
  }, [aboutUsData]);

  useEffect(() => {
    if (coreValuesData && coreValuesData.data.results.length > 0) {
      setCoreValuesContent(coreValuesData.data.results[0].description);
    }
  }, [coreValuesData]);

  useEffect(() => {
    if (termsData && termsData.length > 0) {
      // Assuming the API returns an array, find the terms entry
      const termsEntry =
        termsData.find((item) => item.type === "terms") || termsData[1];
      const privacyContent =
        termsData.find((item) => item.type === "privacy") || termsData[0];
      setTermsContent(termsEntry.content);
      setPrivacyContent(privacyContent.content);
    }
  }, [termsData]);

  useEffect(() => {
    if (userData) {
      setAccountSettings({
        dashboardName: userData.full_name || "Admin User",
        email: userData.email || "admin@cyberadmin.com",
      });
    }
  }, [userData]);
  const handleAccountChange = (field, value) => {
    setAccountSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await updateCurrentUser({
        full_name: accountSettings.dashboardName,
        email: accountSettings.email,
      }).unwrap();
      alert("Account settings saved successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to save account settings. Please try again.");
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      await changePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      }).unwrap();
      alert("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      alert(
        error?.data?.new_password?.[0] ||
          error?.data?.message ||
          "Failed to update password. Please try again."
      );
    }
  };
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Deleting account");
      alert("Account deletion initiated");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: FiSettings },
    { id: "terms", label: "Terms And Condition", icon: FiFileText },
    { id: "privacy", label: "Privacy Policy", icon: FiShield },
    { id: "mission-vision", label: "Our Mission & Vision", icon: FiTarget },
    { id: "about-us", label: "About Us", icon: FiInfo },
  ];

  return (
    <div className="min-h-screen">
      <div>
        {/* Header */}
        <h1 className="text-3xl font-bold text-white pt-0 mt-0 mb-8">
          Settings
        </h1>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-2 transition-colors relative ${
                  activeTab === tab.id
                    ? "text-lime-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* General Tab Content */}
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Account Settings
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Dashboard Name
                  </label>
                  <input
                    type="text"
                    value={accountSettings.dashboardName}
                    onChange={(e) =>
                      handleAccountChange("dashboardName", e.target.value)
                    }
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) =>
                      handleAccountChange("email", e.target.value)
                    }
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={accountSettings.role}
                    onChange={(e) =>
                      handleAccountChange("role", e.target.value)
                    }
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div> */}

                {/* <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Account Status
                  </label>
                  <input
                    type="text"
                    value={accountSettings.status}
                    onChange={(e) =>
                      handleAccountChange("status", e.target.value)
                    }
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div> */}
              </div>

              <button
                onClick={handleSaveChanges}
                className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>

            {/* Password */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Password
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-lime-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpdatePassword}
                className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Update Password
              </button>
            </div>

            {/* Preferences */}
            {/* <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Preferences
              </h2>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <FiBell className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Notifications</h3>
                    <p className="text-sm text-gray-400">
                      Receive notifications about updates and activity
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notificationsEnabled ? "bg-lime-400" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notificationsEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div> */}

            {/* Delete Account */}
            {/* <div className="bg-[#0f0f0f] border border-red-900/50 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FiTrash2 className="w-5 h-5 text-red-500" />
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="text-red-500 font-semibold hover:text-red-400 transition-colors"
                >
                  Delete your account !
                </button>
              </div>
            </div> */}
          </div>
        )}

        {/* Terms Tab Content */}
        {activeTab === "terms" && (
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
            <div className="text-2xl h-1 ml-3 font-medium text-white">
              Terms And Condition
            </div>
            <div className="text-white m-3 text-end">
              {!termIsEdit && (
                <button onClick={() => setTermIsEdit(true)}>Edit</button>
              )}
              {termIsEdit && (
                <button
                  onClick={() => {
                    if (termsData && termsData.length > 0) {
                      updateTermsAndConditions({
                        id: termsData[1].id,
                        content: termsContent,
                      });
                    }
                    setTermIsEdit(false);
                  }}
                >
                  Save
                </button>
              )}
            </div>
            <TextEditor
              isEditable={termIsEdit}
              onChange={(data) => setTermsContent(data)}
              htmlElement={termsContent}
            />
          </div>
        )}

        {/* Privacy Tab Content */}
        {activeTab === "privacy" && (
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
            <div className="text-2xl h-1 ml-4 font-medium text-white">
              Privacy Policy
            </div>
            <div className="text-white m-3 text-end">
              {!privacyIsEdit && (
                <button onClick={() => setPrivacyIsEdit(true)}>Edit</button>
              )}
              {privacyIsEdit && (
                <button
                  onClick={() => {
                    if (termsData && termsData.length > 0) {
                      updateTermsAndConditions({
                        id: termsData[0].id,
                        content: privacyContent,
                      });
                    }
                    setPrivacyIsEdit(false);
                  }}
                >
                  Save
                </button>
              )}
            </div>
            <TextEditor
              isEditable={privacyIsEdit}
              htmlElement={privacyContent}
              onChange={(data) => setPrivacyContent(data)}
            />
          </div>
        )}

        {/* Mission & Vision Tab Content */}
        {activeTab === "mission-vision" && (
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
            <div className="text-2xl h-1 ml-4 font-medium text-white">
              Our Mission & Vision
            </div>
            <div className="text-white m-3 text-end">
              {!missionVisionIsEdit && (
                <button onClick={() => setMissionVisionIsEdit(true)}>
                  Edit
                </button>
              )}
              {missionVisionIsEdit && (
                <button
                  onClick={() => {
                    if (
                      coreValuesData &&
                      coreValuesData.data.results.length > 0
                    ) {
                      updateCoreValues({
                        id: coreValuesData.data.results[0].id,
                        description: coreValuesContent,
                      });
                    }
                    setMissionVisionIsEdit(false);
                  }}
                >
                  Save
                </button>
              )}
            </div>
            <TextEditor
              isEditable={missionVisionIsEdit}
              htmlElement={coreValuesContent}
              onChange={(data) => setCoreValuesContent(data)}
            />
          </div>
        )}
        {/* About Us Tab Content */}
        {activeTab === "about-us" && (
          <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-6">
            <div className="text-2xl h-1 ml-4 font-medium text-white">
              About Us
            </div>
            <div className="text-white m-3 text-end">
              {!aboutUsIsEdit && (
                <button onClick={() => setAboutUsIsEdit(true)}>Edit</button>
              )}
              {aboutUsIsEdit && (
                <button
                  onClick={() => {
                    if (aboutUsData && aboutUsData.data.results.length > 0) {
                      updateAboutUs({
                        id: aboutUsData.data.results[0].id,
                        description: aboutUsContent,
                      });
                    }
                    setAboutUsIsEdit(false);
                  }}
                >
                  Save
                </button>
              )}
            </div>
            <TextEditor
              isEditable={aboutUsIsEdit}
              htmlElement={aboutUsContent}
              onChange={(data) => setAboutUsContent(data)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
