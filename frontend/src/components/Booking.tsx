import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../App.css';

const Booking = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [slots, setSlots] = useState<any>({});

  useEffect(() => {
    if (date) {
      fetchSlots(date);
    }
  }, [date]);

  const fetchSlots = async (date: Date) => {
    try {
      const response = await axios.get('/api/slots', {
        params: { date: date.toISOString().split('T')[0] },
      });
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots', error);
    }
  };

  const getTileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    if (slots[dateString]) {
      const available = slots[dateString].available;
      if (available === 0) return 'full';
      if (available <= 5) return 'low';
      return 'available';
    }
    return '';
  };

  return (
    <div className="booking-container">
      <h2 className="text-center mt-4 mb-10 text-4xl hover:text-5xl text-orange-500">Book a Slot for Experiment</h2>
      <Calendar
        // onChange={setDate}
        value={date}
        tileClassName={getTileClassName}
      />
    </div>
  );
};

export default Booking;
