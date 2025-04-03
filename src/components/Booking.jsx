import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "react-calendar/dist/Calendar.css";
import "../App.css";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaGlobeAmericas,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import "tailwindcss/tailwind.css";

const Booking = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const device = params.get("device") || "Unknown Device";
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [timeZone, setTimeZone] = useState(moment.tz.guess());
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeZones, setShowTimeZones] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const timeZoneRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user.uid : null);
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (timeZoneRef.current && !timeZoneRef.current.contains(event.target)) {
        setShowTimeZones(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (date instanceof Date) {
      fetchSlots(date);
    }
  }, [date, timeZone]);
  
  // Consistent UTC conversion helper function
  const convertLocalToUTC = (localDate, localTime) => {
    // Create a proper moment object in the specified timezone
    const localMoment = moment.tz(
      `${localDate} ${localTime}`,
      "YYYY-MM-DD HH:mm",
      timeZone
    );
    
    // Convert to UTC
    const utcMoment = localMoment.clone().utc();
    
    // Return complete information
    return {
      localMoment,
      utcMoment,
      utcDate: utcMoment.format("YYYY-MM-DD"),
      utcTime: utcMoment.format("HH:mm"),
    };
  };

  const fetchSlots = async (selectedDate) => {
    setIsLoading(true);
    try {
      // Log the current date being fetched
      console.log(`Fetching slots for local date: ${selectedDate.toISOString().split("T")[0]}`);
      
      // Get all time slots for the selected local date
      const slots = generateHourlySlots();

      // Get the unique UTC dates that this local date spans
      const utcDates = [...new Set(slots.map((slot) => slot.utcDate))];
      console.log(`UTC dates that need to be fetched:`, utcDates);

      let slotsData = {};

      // Fetch bookings for each UTC date
      for (const utcDate of utcDates) {
        const q = query(collection(db, "slots"), where("date", "==", utcDate));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (!slotsData[utcDate]) {
            slotsData[utcDate] = [];
          }
          slotsData[utcDate].push(data);
        });
      }

      // Convert to the format expected by the UI
      const dateString = selectedDate.toISOString().split("T")[0];
      setSlots({ [dateString]: Object.values(slotsData).flat() });
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (value) => {
    setDate(value instanceof Date ? value : value[0]);
    setSelectedSlot(null);
  };

  const handleSlotBooking = async () => {
    if (!date || !(date instanceof Date) || !selectedSlot || !currentUser) {
      toast.error("Please select a date and slot first");
      return;
    }

    // Get the selected slot object
    const selectedSlotObj = generateHourlySlots().find(
      (slot) => slot.local === selectedSlot
    );

    if (!selectedSlotObj) {
      toast.error("Invalid slot selection");
      return;
    }

    // Use our consistent conversion helper
    const localDate = date.toISOString().split("T")[0]; // e.g. '2025-03-06'
    const localTime = selectedSlot.split("-")[0]; // e.g. '00:00'
    const localEndTime = selectedSlot.split("-")[1]; // e.g. '01:00'

    // Convert both start and end times using our helper function
    const startConversion = convertLocalToUTC(localDate, localTime);
    const endConversion = convertLocalToUTC(localDate, localEndTime);
    
    // Extract UTC values
    const utcDateString = startConversion.utcDate;
    const utcTimeStart = startConversion.utcTime;
    const utcTimeEnd = endConversion.utcTime;
    
    // Create the UTC time slot
    const utcTimeSlot = `${utcTimeStart}-${utcTimeEnd}`;

    console.log("BOOKING CONVERSION:", {
      "Local DateTime": `${localDate} ${localTime}`,
      "Local Timezone": timeZone,
      "UTC Date": utcDateString,
      "UTC Time": utcTimeSlot,
      "UTC ISO": startConversion.utcMoment.toISOString(),
    });

    // Check if the slot is already booked - need to check using UTC date and time
    const q = query(
      collection(db, "slots"),
      where("date", "==", utcDateString),
      where("slot", "==", utcTimeSlot)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error(`Slot ${selectedSlot} is already booked`);
      return;
    }

    // Count user's bookings for this date
    const userBookingsQuery = query(
      collection(db, "slots"),
      where("date", "==", utcDateString),
      where("user", "==", currentUser)
    );

    const userBookings = await getDocs(userBookingsQuery);
    if (userBookings.size >= 2) {
      toast.error("You can only book 2 slots per day");
      return;
    }

    // Show confirmation with more details
    // Format the local date and UTC date for better human readability
    const formattedLocalDate = date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    const formattedUtcDate = moment.utc(utcDateString).format('ddd MMM DD YYYY');
    
    const confirmMessage =
      `Booking Details:\n\n` +
      `📅 Your Local Date: ${formattedLocalDate}\n` +
      `🕒 Your Local Time: ${selectedSlot}\n` +
      `🌐 Your Timezone: ${timeZone} (${moment.tz(timeZone).format("Z")})\n` +
      `🔧 Device: ${device}\n\n` +
      `Note: This slot will be stored in UTC as:\n` +
      `${formattedUtcDate} ${utcTimeSlot}\n` +
      `(This date difference is normal due to your timezone offset)\n\n` +
      `Would you like to confirm this booking?`;

    if (window.confirm(confirmMessage)) {
      setIsLoading(true);
      try {
        await addDoc(collection(db, "slots"), {
          user: currentUser,
          date: utcDateString, // Store UTC date
          slot: utcTimeSlot, // Store corrected UTC time slot
          slotLocal: selectedSlot,
          timeZone: timeZone,
          slotUTC: utcTimeStart,
          device: device,
          tbCreated: false,
          bookingTime: moment().toISOString(), // Add booking timestamp
          debugInfo: {
            localDateTime: `${localDate}T${localTime}:00`,
            localTimezone: timeZone,
            utcConvertedDate: utcDateString,
            manualCalculation: true,
          },
        });

        // Refetch the slots with the updated UTC date
        if (date instanceof Date) {
          fetchSlots(date);
        }
        setSelectedSlot(null);
        toast.success("Slot booked successfully! 🎉");
      } catch (error) {
        console.error("Booking error:", error);
        toast.error(`Failed to book slot: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const generateHourlySlots = () => {
    if (!(date instanceof Date)) return [];
    const startHour = 0;
    
    // Get the current date in YYYY-MM-DD format
    const localDate = date.toISOString().split("T")[0];
    
    return Array.from({ length: 24 }, (_, i) => {
      const hour = (startHour + i) % 24;
      const nextHour = (startHour + i + 1) % 24;

      // Format local time strings
      const localStart = `${String(hour).padStart(2, "0")}:00`;
      const localEnd = `${String(nextHour).padStart(2, "0")}:00`;
      const localSlot = `${localStart}-${localEnd}`;

      // Convert start time to UTC using our helper function
      const startConversion = convertLocalToUTC(localDate, localStart);
      
      // Convert end time to UTC
      const endConversion = convertLocalToUTC(localDate, localEnd);
      
      // Create UTC time slot
      const utcSlot = `${startConversion.utcTime}-${endConversion.utcTime}`;
      
      // Debug specific slots
      if (localStart === "00:00" || localStart === "01:00" || localStart === "23:00") {
        console.log(`DEBUG Slot ${localSlot}:`, {
          "Local DateTime": `${localDate} ${localStart}`,
          "UTC DateTime": `${startConversion.utcDate} ${startConversion.utcTime}`,
          "UTC Date": startConversion.utcDate
        });
      }

      return {
        local: localSlot,
        utc: utcSlot,
        utcDate: startConversion.utcDate,
        utcStartMoment: startConversion.utcMoment,
      };
    });
  };

  const getSlotColorClass = (slot) => {
    const dateString = date.toISOString().split("T")[0];

    if (selectedSlot === slot.local) {
      return "bg-yellow-500 hover:bg-yellow-600 text-white transform scale-105 shadow-md";
    }

    // Check if this slot is booked - comparing both date and time
    if (slots[dateString]?.some((s) => {
      return s.date === slot.utcDate && s.slot === slot.utc;
    })) {
      return "bg-red-500 hover:bg-red-600 text-white opacity-70";
    }

    return "bg-green-500 hover:bg-green-600 text-white";
  };

  const groupedTimeZones = () => {
    const zones = moment.tz.names();

    // Filter zones by search query if exists
    const filteredZones = searchQuery
      ? zones.filter(
          (zone) =>
            zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            moment.tz(zone).format("Z").includes(searchQuery)
        )
      : zones;

    // Group time zones by offset
    const groupedZones = filteredZones.reduce((acc, zone) => {
      const offsetStr = moment.tz(zone).format("Z");
      const region = zone.split("/")[0];
      const key = `${offsetStr} (${region})`;

      if (!acc[key]) acc[key] = [];
      acc[key].push(zone);
      return acc;
    }, {});

    return Object.entries(groupedZones).sort((a, b) => {
      // Extract just the UTC offset for sorting
      const offsetA = a[0].split(" ")[0];
      const offsetB = b[0].split(" ")[0];
      return (
        moment.utc().utcOffset(offsetA).utcOffset() -
        moment.utc().utcOffset(offsetB).utcOffset()
      );
    });
  };

  return (
    <div className="booking-container p-4 md:p-8 w-full max-w-6xl mx-auto">
      <Toaster position="top-center" />

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center my-6 text-3xl md:text-4xl font-bold text-orange-500 hover:text-orange-600 transition-all duration-300"
      >
        <FaCalendarAlt className="inline-block mr-2 mb-1" />
        Book a Slot for Experiment
      </motion.h2>

      <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex items-center">
          <FaGlobeAmericas className="text-blue-500 text-xl mr-2" />
          <label className="text-lg font-medium">Select Time Zone:</label>
        </div>

        <div className="relative w-full md:w-auto" ref={timeZoneRef}>
          <button
            onClick={() => setShowTimeZones(!showTimeZones)}
            className="w-full md:w-auto flex items-center justify-between border border-gray-300 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>
              {timeZone} ({moment.tz(timeZone).format("Z")})
            </span>
            <span className="ml-2">{showTimeZones ? "▲" : "▼"}</span>
          </button>

          <AnimatePresence>
            {showTimeZones && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 mt-1 w-full md:w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                <div className="sticky top-0 bg-gray-100 p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search time zones..."
                    className="w-full p-2 border rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {groupedTimeZones().length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No timezones found
                  </div>
                ) : (
                  groupedTimeZones().map(([group, zones]) => (
                    <div
                      key={group}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <div className="bg-gray-50 p-2 font-semibold">
                        {group}
                      </div>
                      {zones.map((tz) => (
                        <div
                          key={tz}
                          className={`tz-item p-2 hover:bg-blue-50 cursor-pointer ${
                            timeZone === tz ? "bg-blue-100" : ""
                          }`}
                          onClick={() => {
                            setTimeZone(tz);
                            setShowTimeZones(false);
                            setSearchQuery("");
                          }}
                        >
                          {tz} ({moment.tz(tz).format("HH:mm")})
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-center gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="calendar-container w-full md:w-auto"
        >
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="shadow-lg rounded-lg bg-white border-0"
            tileClassName="text-lg p-3"
            prevLabel={<span className="text-blue-500">←</span>}
            nextLabel={<span className="text-blue-500">→</span>}
          />

          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold mb-2 flex items-center">
              <FaClock className="mr-2 text-orange-500" />
              Selected Date
            </h3>
            <p className="text-lg">
              {date instanceof Date
                ? date.toDateString()
                : "Please select a date"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Your local date & time:{" "}
              {moment().tz(timeZone).format("YYYY-MM-DD HH:mm")}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Timezone: {timeZone} ({moment.tz(timeZone).format("Z")})
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="slots-container w-full md:w-3/5"
        >
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="font-semibold mb-3">Available Time Slots</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <AnimatePresence>
                {isLoading ? (
                  <div className="w-full p-6 flex justify-center">
                    <svg
                      className="animate-spin h-10 w-10 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  generateHourlySlots().map((slot, index) => (
                    <motion.button
                      key={slot.utc}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.01 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 border rounded-lg text-center ${getSlotColorClass(
                        slot
                      )} transition-all duration-200`}
                      onClick={() => setSelectedSlot(slot.local)}
                      disabled={slots[date.toISOString().split("T")[0]]?.some(
                        (s) => s.slot === slot.utc
                      )}
                    >
                      {slot.local}
                      {slots[date.toISOString().split("T")[0]]?.some(
                        (s) => s.slot === slot.utc
                      ) ? (
                        <FaTimesCircle className="ml-1 inline" />
                      ) : selectedSlot === slot.local ? (
                        <FaCheckCircle className="ml-1 inline" />
                      ) : null}
                    </motion.button>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Booked</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${
                !selectedSlot
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md flex items-center`}
              onClick={handleSlotBooking}
              disabled={!selectedSlot || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Booking...
                </span>
              ) : (
                <span>Book Slot</span>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {selectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-md mx-auto max-w-2xl"
        >
          <h3 className="font-bold mb-2">Selected Booking:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              <span>Date: {date.toDateString()}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-blue-500" />
              <span>Time: {selectedSlot}</span>
            </div>
            <div className="flex items-center">
              <FaGlobeAmericas className="mr-2 text-blue-500" />
              <span>Timezone: {timeZone}</span>
            </div>
            <div>
              <span>Device: {device}</span>
            </div>
          </div>
        </motion.div>
      )}

      {notification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg shadow"
        >
          {notification}
        </motion.div>
      )}
    </div>
  );
};

export default Booking;
