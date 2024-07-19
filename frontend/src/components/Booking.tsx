import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../App.css';

const Booking = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [slots, setSlots] = useState<any>({});



  return (
    <div className="booking-container">
      <h2 className="text-center mt-4 mb-10 text-4xl hover:text-5xl text-orange-500">Book a Slot for Experiment</h2>
      <Calendar
        onChange={setDate}
        value={date}
        
      />
    </div>
  );
};

export default Booking;
