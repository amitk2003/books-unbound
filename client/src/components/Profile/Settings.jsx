import { useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="space-y-6 max-w-3xl">

        {/* Account Settings */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#2A2A2A]">
          <h2 className="text-lg font-medium mb-4">Account Settings</h2>

          <div className="grid gap-4">
            <input className="input" placeholder="Name" />
            <input className="input" placeholder="Email" />
            <input className="input" placeholder="Password" type="password" />

            <button className="btn-primary w-fit">Save Changes</button>
          </div>
        </div>

        {/* Address */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#2A2A2A]">
          <h2 className="text-lg font-medium mb-4">Delivery Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Address Line" />
            <input className="input" placeholder="City" />
            <input className="input" placeholder="State" />
            <input className="input" placeholder="Pincode" />
          </div>

          <button className="btn-primary mt-4">Save Address</button>
        </div>

        {/* Notifications */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#2A2A2A]">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>

          <div className="space-y-3">
            <Toggle label="Order updates" />
            <Toggle label="Delivery status" />
            <Toggle label="Discounts & offers" />
            <Toggle label="New arrivals" />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border border-[#2A2A2A]">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>

          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                darkMode ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition ${
                  darkMode ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#1E1E1E] rounded-lg p-6 border border-red-500/30">
          <h2 className="text-lg font-medium text-red-400 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            This action cannot be undone.
          </p>

          <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}

/* Toggle Component */
function Toggle({ label }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-blue-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transition ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
