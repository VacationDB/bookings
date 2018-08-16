import React from 'react';
import PropTypes from 'prop-types';
import styles from './Calendar.css';


const Calendar = (props) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const baseMatrix = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  const {
    year,
    month,
    availableDates,
    minStay,
    selectDate,
    requestedDates,
    clearDates,
    changeMonth,
    icons: {
      leftArrow,
      rightArrow,
    },
  } = props;

  const monthFirstDay = new Date(year, month, 1);
  const monthLastDay = new Date(year, month + 1, 0);
  const currentMonth = new Date().getMonth();

  const bookingsMonthIndex = month < currentMonth ? currentMonth + month : month - currentMonth;
  const currentAvailableDates = [...availableDates[bookingsMonthIndex]];
  // declare counter to fill table with dates
  let currentDateNum = 1;

  // return a tuple defining a date cell's attributes >>> [classNames, clickhandler, cellValue]
  const getAttributes = function (currentCellData) {
    // check if date is invalid (cellData = '')
    if (currentCellData === '') {
      return ['', null, ''];
    }
    let isSelectingCheckout = false;
    let minStayDate;

    if (requestedDates[0] !== undefined) {
      minStayDate = new Date(requestedDates[0].getTime() + (minStay * 86400000));
      isSelectingCheckout = true;
    }
    const cellDate = new Date(year, month, currentDateNum);
    const validDateClickHandler = e => selectDate(+e.target.innerHTML);

    const attributes = [
      // className
      styles.day,
      // clickHandler
      null,
      // cellValue
      currentDateNum,
    ];

    // check if date is selected
    if ((requestedDates.length >= 1
        && requestedDates[0].getTime() === cellDate.getTime())
      || (requestedDates.length === 2
        && requestedDates[1].getTime() === cellDate.getTime())) {
      attributes[0] += ` ${styles.selectedDate} selected-date`;
    // check if date is within range of selected dates
    } else if (requestedDates.length === 2
      && cellDate > requestedDates[0]
      && cellDate < requestedDates[1]) {
      attributes[0] += ` ${styles.range} range`;
    // check if date is booked
    } else if (isSelectingCheckout) {
      if (cellDate.getTime() < minStayDate.getTime()) {
        attributes[0] += ` ${styles.booked}`;
      } else {
        attributes[0] += ` avail ${styles.avail}`;
        attributes[1] = validDateClickHandler;
      }
    } else if (currentDateNum === currentAvailableDates[currentAvailableDates.length - 1]
      && !isSelectingCheckout) {
      attributes[0] += ` avail ${styles.avail}`;
      attributes[1] = validDateClickHandler;
      currentAvailableDates.pop();
    } else {
      attributes[0] += ` ${styles.booked}`;
    }
    currentDateNum += 1;
    return attributes;
  };

  const renderDateCell = function (currentCell) {
    if (currentDateNum > monthLastDay.getDate()) {
      return null;
    }

    const attributes = getAttributes(currentCell);

    return (
      <td 
        key={`cell${cellKeyCount++}`}
        className={attributes[0]}
        onClick={attributes[1]}>
        {attributes[2]}
      </td>
    );
  };

  // assign first values of matrix to empty value (for proper alignment)
  for (let i = 0; i < monthFirstDay.getDay(); i += 1) {
    baseMatrix[0][i] = '';
  }
  let cellKeyCount = 0;
  let weekKeyCount = 0;
  return (
    <div className={styles.calContainer} id="cal-container">
      <div className={styles.calendarTitle} id="calendar-title">
        <img src={leftArrow} className={styles.calTitle + ' ' + styles.icon} id="prev-month" onClick={() => changeMonth(-1)}/>
        <p className={styles.calTitle}>
          {`${months[monthFirstDay.getMonth()]} ${year}`}
        </p>
        <img src={rightArrow} className={styles.calTitle + ' ' + styles.icon} id="next-month" onClick={() => changeMonth(1)}/>
      </div>
      <table className={styles.calendar} id="calendar">
        <tbody>
          <tr>
            <th className={styles.calHeaders}>
              Sun
            </th>
            <th className={styles.calHeaders}>
              Mon
            </th>
            <th className={styles.calHeaders}>
              Tues
            </th>
            <th className={styles.calHeaders}>
              Wed
            </th>
            <th className={styles.calHeaders}>
              Thur
            </th>
            <th className={styles.calHeaders}>
              Fri
            </th>
            <th className={styles.calHeaders}>
              Sat
            </th>
          </tr>
          {baseMatrix.map(week => (
            <tr key={`week${weekKeyCount++}`}>
              {week.map(cell => renderDateCell(cell))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className={styles.text}>
        {`${minStay} nights minimum stay.`}
      </p>
      <button
        onClick={clearDates}
        style={{
          width: '150px',
          cursor: 'pointer',
          color: 'rgb(0, 166, 153)',
          height: '20px',
          border: 'none',
          fontSize: 'medium',
        }}
        type="button"
      >
        Clear Dates
      </button>
    </div>
  );
};

Calendar.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  minStay: PropTypes.number.isRequired,
  selectDate: PropTypes.func.isRequired,
  clearDates: PropTypes.func.isRequired,
};

// Calender.defaultProps = {
//   minStay: 5,
// };

export default Calendar;
