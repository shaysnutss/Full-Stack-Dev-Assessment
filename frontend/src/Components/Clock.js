import React, { useState, useEffect } from 'react';
import "./Clock.css";

function Clock() {
  let [year, setYear] = useState();
  let [days, setDays] = useState();
  let [months, setMonths] = useState();
  let [monthDates, setMonthDate] = useState();

  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // This is used to run this once a day.
  useEffect(() => {
    const intervalId = setInterval(() => {
      let date = new Date();
      let day = date.getDay();
      setDays(day);
      let month = date.getMonth();
      setMonths(month);
      let monthDate = date.getDate();
      setMonthDate(monthDate);
      let year = date.getFullYear();
      setYear(year);
    }); // 24 hours in milliseconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

  let monthh = monthList[months];
  return (
    <div className="container">
      <p className="year">
        {monthh} {monthDates} {year}
      </p>
    </div>
  );
}

export default Clock;