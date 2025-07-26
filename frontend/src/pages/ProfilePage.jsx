import { useEffect, useState } from 'react';
import defaultAvatar from '../assets/avatar.png';
import axiosInstance from '../axiosInstance';

export default function ProfilePage() {


  const [user, setUser] = useState({
    name: '',
    email: '',
    lastLogin: '2025-07-20 15:30',
    updatedAt: '2025-07-19 14:00',
    avatar: defaultAvatar,
  });

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axiosInstance.get("/users/me");

        setUser((prev) => ({
          ...prev,
          name: response.data.fullName,
          email: response.data.email,
          lastLogin: response.data.lastLogin,
          updatedAt: response.data.updatedAt,
          avatar: defaultAvatar,
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfileData();
  }, []);



  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });

  // 🖼️ Handle text changes
  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // 📸 Handle local image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUser(editData);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-xl mx-auto rounded-2xl shadow-lg p-6 bg-white/5">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-sm object-cover"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
            {user.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-300">{user.email}</p>

          <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Last Login:</strong> {user.lastLogin}
            </p>
            <p>
              <strong>Last Updated:</strong> {user.updatedAt}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* 📝 Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg dark:bg-gray-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Edit Profile</h3>
            <div className="space-y-4">
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={editData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={editData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
              />
              <div className="space-y-1">
                <label className="text-sm text-gray-600 dark:text-gray-300">Choose Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <img
                src={editData.avatar}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover rounded-full border-2 border-blue-400 mx-auto"
              />
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
