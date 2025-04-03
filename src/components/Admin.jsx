import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  addDoc,
  setDoc,
} from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deviceStats, setDeviceStats] = useState([]);
  const [slotTimeStats, setSlotTimeStats] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("week");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    const fetchUsersAndSlots = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const slotsSnapshot = await getDocs(collection(db, "slots"));
        const adminsSnapshot = await getDocs(collection(db, "admins"));

        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const slotsList = slotsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: new Date(doc.data().date),
        }));

        const adminsList = adminsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersList);
        setSlots(slotsList);
        setAdmins(adminsList);

        // Calculate device statistics
        const devices = {};
        slotsList.forEach((slot) => {
          if (slot.device) {
            devices[slot.device] = (devices[slot.device] || 0) + 1;
          }
        });

        const deviceData = Object.keys(devices).map((key) => ({
          name: key,
          value: devices[key],
        }));
        setDeviceStats(deviceData);

        // Calculate slot time statistics
        const slotTimes = {};
        slotsList.forEach((slot) => {
          if (slot.slot) {
            slotTimes[slot.slot] = (slotTimes[slot.slot] || 0) + 1;
          }
        });

        const timeData = Object.keys(slotTimes).map((key) => ({
          time: key,
          bookings: slotTimes[key],
        }));

        // Sort by time slot
        timeData.sort((a, b) => {
          const timeA = parseInt(a.time.split(":")[0]);
          const timeB = parseInt(b.time.split(":")[0]);
          return timeA - timeB;
        });

        setSlotTimeStats(timeData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotification("Failed to load data. Please refresh the page.");
        setLoading(false);
      }
    };

    fetchUsersAndSlots();
  }, []);

  useEffect(() => {
    // Clear notification after 5 seconds
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleApproval = async (userId, approve) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { approved: approve });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, approved: approve } : user
        )
      );
      setNotification(
        approve ? "User approved successfully!" : "User disapproved."
      );
    } catch (error) {
      setNotification("Failed to update user approval status.");
    }
  };

  const handleUserRemoval = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        const userRef = doc(db, "users", userId);
        await deleteDoc(userRef);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setNotification("User removed successfully!");
      } catch (error) {
        setNotification("Failed to remove user.");
      }
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminEmail.includes("@")) {
      setNotification("Please enter a valid email address.");
      return;
    }

    // Check if email already exists in the admins collection
    const exists = admins.some((admin) => admin.email === newAdminEmail);
    if (exists) {
      setNotification("This email is already an administrator.");
      return;
    }

    try {
      const adminData = {
        email: newAdminEmail,
        addedOn: new Date(),
      };

      const docRef = await addDoc(collection(db, "admins"), adminData);

      // Add to local state with the new ID
      setAdmins([...admins, { id: docRef.id, ...adminData }]);
      setNewAdminEmail(""); // Clear the input field
      setNotification("Administrator added successfully!");
    } catch (error) {
      console.error("Error adding admin:", error);
      setNotification("Failed to add administrator. Please try again.");
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    if (window.confirm("Are you sure you want to remove this administrator?")) {
      try {
        const adminRef = doc(db, "admins", adminId);
        await deleteDoc(adminRef);
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin.id !== adminId)
        );
        setNotification("Administrator removed successfully!");
      } catch (error) {
        console.error("Error removing admin:", error);
        setNotification("Failed to remove administrator.");
      }
    }
  };

  const handleSlotRemoval = async (slotId) => {
    if (window.confirm("Are you sure you want to remove this booking?")) {
      try {
        const slotRef = doc(db, "slots", slotId);
        await deleteDoc(slotRef);
        setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== slotId));
        setNotification("Booking removed successfully!");
      } catch (error) {
        setNotification("Failed to remove booking.");
      }
    }
  };

  const getDateRange = () => {
    const today = new Date();
    let startDate;

    if (dateRange === "week") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (dateRange === "month") {
      startDate = new Date();
      startDate.setMonth(today.getMonth() - 1);
    } else if (dateRange === "quarter") {
      startDate = new Date();
      startDate.setMonth(today.getMonth() - 3);
    }

    return slots.filter((slot) => slot.date >= startDate && slot.date <= today);
  };

  const getBookingsPerDay = () => {
    const filteredSlots = getDateRange();
    const bookingsPerDay = {};

    filteredSlots.forEach((slot) => {
      const dateString = slot.date.toDateString();
      bookingsPerDay[dateString] = (bookingsPerDay[dateString] || 0) + 1;
    });

    return Object.keys(bookingsPerDay)
      .map((date) => ({
        date: date.split(" ").slice(1, 3).join(" "), // Format as "Jan 01"
        bookings: bookingsPerDay[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const filteredSlots = selectedDate
    ? slots.filter(
        (slot) => slot.date.toDateString() === selectedDate.toDateString()
      )
    : slots;

  const filteredUsers = users.filter(
    (user) =>
      user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.email &&
      admin.email.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  const totalUsers = users.length;
  const approvedUsers = users.filter((user) => user.approved).length;
  const disapprovedUsers = totalUsers - approvedUsers;
  const totalBookings = slots.length;
  const bookingsChart = getBookingsPerDay();

  return (
    <div className="admin-container p-4 bg-gray-50 min-h-screen">
      <h2 className="text-center mt-2 mb-6 text-3xl md:text-4xl text-orange-500 font-bold">
        Admin Dashboard
      </h2>

      {notification && (
        <div className="fixed top-4 right-4 p-4 bg-orange-100 text-orange-800 rounded-lg shadow-lg z-50 max-w-xs md:max-w-md">
          {notification}
          <button
            className="absolute top-1 right-2 text-orange-800"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Mobile Navigation Tabs */}
      <div className="md:hidden flex overflow-x-auto mb-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === "dashboard"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === "users"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === "bookings"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
        <button
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === "analytics"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className={`px-4 py-2 whitespace-nowrap ${
            activeTab === "adminManagement"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("adminManagement")}
        >
          Admins
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar for larger screens */}
          <div className="hidden md:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h3 className="text-xl font-semibold mb-6 border-b pb-2">
                Admin Controls
              </h3>
              <ul>
                <li className="mb-2">
                  <button
                    className={`w-full text-left py-2 px-4 rounded ${
                      activeTab === "dashboard"
                        ? "bg-orange-100 text-orange-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    Dashboard
                  </button>
                </li>
                <li className="mb-2">
                  <button
                    className={`w-full text-left py-2 px-4 rounded ${
                      activeTab === "users"
                        ? "bg-orange-100 text-orange-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("users")}
                  >
                    Manage Users
                  </button>
                </li>
                <li className="mb-2">
                  <button
                    className={`w-full text-left py-2 px-4 rounded ${
                      activeTab === "bookings"
                        ? "bg-orange-100 text-orange-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("bookings")}
                  >
                    Bookings Calendar
                  </button>
                </li>
                <li className="mb-2">
                  <button
                    className={`w-full text-left py-2 px-4 rounded ${
                      activeTab === "analytics"
                        ? "bg-orange-100 text-orange-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("analytics")}
                  >
                    Analytics & Reports
                  </button>
                </li>
                <li className="mb-2">
                  <button
                    className={`w-full text-left py-2 px-4 rounded ${
                      activeTab === "adminManagement"
                        ? "bg-orange-100 text-orange-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("adminManagement")}
                  >
                    Admin Management
                  </button>
                </li>
              </ul>

              <div className="mt-8 bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-700 mb-2">
                  Quick Stats
                </h4>
                <p className="mb-1 text-sm">Total Users: {totalUsers}</p>
                <p className="mb-1 text-sm">Total Bookings: {totalBookings}</p>
                <p className="mb-1 text-sm">
                  Approval Rate:{" "}
                  {totalUsers
                    ? Math.round((approvedUsers / totalUsers) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    User Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700">Total</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {totalUsers}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700">Approved</p>
                      <p className="text-2xl font-bold text-green-800">
                        {approvedUsers}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-700">Pending</p>
                      <p className="text-2xl font-bold text-yellow-800">
                        {disapprovedUsers}
                      </p>
                    </div>
                  </div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Approved", value: approvedUsers },
                            { name: "Pending", value: disapprovedUsers },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          <Cell fill="#4ade80" />
                          <Cell fill="#facc15" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    Recent Bookings
                  </h3>
                  <div className="mb-4">
                    <select
                      className="border rounded p-2 text-sm w-full md:w-auto"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="quarter">Last 90 Days</option>
                    </select>
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bookingsChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    Popular Devices
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceStats}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {deviceStats.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">
                    Popular Time Slots
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={slotTimeStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="text-xl font-semibold mb-2 md:mb-0">
                    Manage Users
                  </h3>
                  <div className="w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search by email..."
                      className="border rounded p-2 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 border-b">{user.email}</td>
                            <td className="py-3 px-4 border-b">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.approved
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {user.approved ? "Approved" : "Pending"}
                              </span>
                            </td>
                            <td className="py-3 px-4 border-b">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                  onClick={() => handleApproval(user.id, true)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                                  onClick={() => handleApproval(user.id, false)}
                                >
                                  Reject
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                  onClick={() => handleUserRemoval(user.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-4 text-center text-gray-500"
                          >
                            No users found with that email.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Select Date</h3>
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    className="mx-auto"
                    tileClassName={({ date }) => {
                      const hasBooking = slots.some(
                        (slot) =>
                          slot.date.toDateString() === date.toDateString()
                      );
                      return hasBooking ? "bg-orange-100" : null;
                    }}
                  />
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-100 mr-2"></div>
                      <span>Dates with bookings</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white w-[200%] p-2 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                      Bookings for{" "}
                      {selectedDate
                        ? selectedDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "All Dates"}
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Device
                          </th>
                          <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredSlots.length > 0 ? (
                          filteredSlots.map((slot) => (
                            <tr key={slot.id} className="hover:bg-gray-50">
                              <td className="py-2 px-4 border-b">
                                {slot.user}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {slot.date.toLocaleDateString()}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {slot.slot}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {slot.device}
                              </td>
                              <td className="py-2 px-4 border-b">
                                <button
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                  onClick={() => handleSlotRemoval(slot.id)}
                                >
                                  Cancel
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="py-4 text-center text-gray-500"
                            >
                              No bookings found for this date.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Management Tab */}
            {activeTab === "adminManagement" && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h3 className="text-xl font-semibold mb-2 md:mb-0">
                    Manage Administrators
                  </h3>
                  <div className="w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search admin by email..."
                      className="border rounded p-2 w-full"
                      value={adminSearchQuery}
                      onChange={(e) => setAdminSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Add new admin form */}
                <div className="bg-orange-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-orange-700 mb-3">
                    Add New Administrator
                  </h4>
                  <div className="flex flex-col md:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="border rounded p-2 flex-grow"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                      onClick={handleAddAdmin}
                    >
                      Add Admin
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Adding a new admin will grant them full access to this admin
                    dashboard.
                  </p>
                </div>

                {/* Admin list table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Added On
                        </th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAdmins.length > 0 ? (
                        filteredAdmins.map((admin) => (
                          <tr key={admin.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 border-b">
                              {admin.email}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {admin.addedOn
                                ? new Date(
                                    admin.addedOn.seconds * 1000
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="py-3 px-4 border-b">
                              <button
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                onClick={() => handleRemoveAdmin(admin.id)}
                              >
                                Remove Admin
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-4 text-center text-gray-500"
                          >
                            {admins.length === 0
                              ? "No administrators found."
                              : "No administrators matching your search."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Booking Trends</h3>
                  <div className="mb-4">
                    <select
                      className="border rounded p-2 text-sm"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="quarter">Last 90 Days</option>
                    </select>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bookingsChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="bookings" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">
                      Device Popularity
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceStats}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {deviceStats.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">
                      Popular Time Slots
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={slotTimeStats} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="time" type="category" width={80} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="bookings" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
