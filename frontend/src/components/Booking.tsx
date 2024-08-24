import React, { useState, useEffect } from 'react';
import Calendar, { Value } from 'react-calendar';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import 'react-calendar/dist/Calendar.css';
import '../App.css';

type SlotData = {
  slot: string;
};

const Booking: React.FC = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [slots, setSlots] = useState<{ [key: string]: SlotData[] }>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (date && date instanceof Date) {
      fetchSlots(date);
    }
  }, [date]);

  const fetchSlots = async (selectedDate: Date) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const q = query(collection(db, 'slots'), where('date', '==', dateString));
    const querySnapshot = await getDocs(q);
    const slotsData: { [key: string]: SlotData[] } = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data() as SlotData;
      if (!slotsData[dateString]) {
        slotsData[dateString] = [];
      }
      slotsData[dateString].push(data);
    });

    setSlots(slotsData);
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setDate(value);
    } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof Date) {
      setDate(value[0]);
    }
  };

  const handleSlotBooking = async () => {
    if (!date || !(date instanceof Date) || !selectedSlot) return;

    const dateString = date.toISOString().split('T')[0];

    // Check if the selected slot is already booked
    if (slots[dateString] && slots[dateString].some((slot) => slot.slot === selectedSlot)) {
      setNotification(`Slot ${selectedSlot} on ${date.toDateString()} is already booked.`);
      return;
    }

    if (window.confirm(`Are you sure you want to book ${selectedSlot} on ${date.toDateString()}?`)) {
      try {
        const slotRef = collection(db, 'slots');
        await addDoc(slotRef, {
          date: dateString,
          slot: selectedSlot,
        });

        fetchSlots(date);
        setNotification(`Slot ${selectedSlot} on ${date.toDateString()} booked successfully!`);
      } catch (error) {
        setNotification(`Failed to book slot ${selectedSlot}. Please try again.`);
      }
    }
  };

  const getTileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    if (slots[dateString]) {
      return 'booked';
    }
    return '';
  };

  const generateHourlySlots = () => {
    if (!date || !(date instanceof Date)) return [];

    const slotsArray = [];
    for (let i = 0; i < 24; i++) {
      const slotTime = new Date(date);
      slotTime.setHours(i, 0, 0, 0);
      const startTimeString = slotTime.toTimeString().split(' ')[0].substring(0, 5);
      slotTime.setHours(i + 1);
      const endTimeString = slotTime.toTimeString().split(' ')[0].substring(0, 5);
      slotsArray.push(`${startTimeString}-${endTimeString}`);
    }
    return slotsArray;
  };

  return (
    <div className="booking-container flex flex-col items-center">
      <h2 className="text-center mt-4 mb-10 text-4xl hover:text-5xl text-orange-500">Book a Slot for Experiment</h2>
      <div className="flex space-x-8">
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileClassName={getTileClassName}
            className="shadow-lg rounded-lg"
          />
        </div>
        <div className="slots-container grid grid-cols-4 gap-0 justify-center">
          {generateHourlySlots().map((slot) => (
            <button
              key={slot}
              className={`p-2 border rounded-lg text-center ${
                selectedSlot === slot ? 'bg-yellow-500 text-white ' :
                slots[date?.toISOString().split('T')[0]]?.some((s) => s.slot === slot) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
              onClick={() => setSelectedSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
      {date && date instanceof Date && (
        <div className="mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={handleSlotBooking}
          >
            Book Slot
          </button>
        </div>
      )}
      {notification && (
        <div className="mt-4 p-4 bg-yellow-200 text-yellow-800 rounded-lg">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Booking;
