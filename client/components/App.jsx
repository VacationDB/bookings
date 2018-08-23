import React from 'react';
import Calendar from './Calendar/Calendar';
import CalendarTitle from './Calendar/CalendarTitle';
import Pricing from './Pricing/Pricing';
import Guests from './Guests/Guests';
import SubmitBtn from './SubmitBtn/SubmitBtn';
import styles from './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      availableDates: [],
      requestedDates: [],
      id: 0,
      guestCount: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      displayModalView: false,
      displayBreakpoint: 1123,
      checkOutStage: 0,
      price: 0,
      cleaningFee: 0,
      maxGuests: 0,
      minStay: 0,
      serviceFee: 0,
      isSelectingGuests: false,
      showPopUpInfo: 0,
      icons: {
        rightArrow: 'https://s3-us-west-1.amazonaws.com/airbnh/1ee4c3ee10a89d4ebe3782b2ff0d9eea.svg',
        leftArrow: 'https://s3-us-west-1.amazonaws.com/airbnh/290174b6259ea557de7fde682836d3c6.svg',
        checkInArrow: 'https://s3-us-west-1.amazonaws.com/airbnh/29b551dcd3f19344833ca08acff525b5.svg',
        upArrow: 'https://s3-us-west-1.amazonaws.com/airbnh/bff49638bbcb0d2fab698049dcc4cfc3.svg',
        downArrow: 'https://s3-us-west-1.amazonaws.com/airbnh/d51c4cbdf58ed633c094cc393e644e66.svg',
        plus: 'https://s3-us-west-1.amazonaws.com/airbnh/d4732b3d3b9892e0280e087890cef098.svg',
        minus: 'https://s3-us-west-1.amazonaws.com/airbnh/2beb6d5e654eaef08df5e487f1dab267.svg',
        question: 'https://s3-us-west-1.amazonaws.com/airbnh/ff5b6345f1c57baf6ceb0d89641a3c19.svg',

      },
    };
    this.setNextStage = this.setNextStage.bind(this);
    this.setSelectedDate = this.setSelectedDate.bind(this);
    this.getCalendarTitle = this.getCalendarTitle.bind(this);
    this.updateGuestCount = this.updateGuestCount.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.clearDates = this.clearDates.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
    this.updateGuestCount = this.updateGuestCount.bind(this);
    this.toggleGuestSelectView = this.toggleGuestSelectView.bind(this);
    this.toggleInfoPopUp = this.toggleInfoPopUp.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.renderGuestTitle = this.renderGuestTitle.bind(this);
  }

  componentDidMount() {
    if (this.props.id) {
      this.setState({ ...this.props });
    } else {
      const path = window.location.pathname.split('/');
      const id = +path[path.length - 2] || 1;
      fetch(`/api/listings/${id}`)
        .then(res => res.json())
        .then((body) => {
          // Convert New Data Shape of date objects into expected matrix of AvailableDates original code format
          const convertDatesIntoCalender = (body) => {
            // create full calender
            const createMonth = (max) => {
              const array = [];
              for (let n = 1; n <= max; n++) {
                array.push(n);
              }
              return array;
            };
            const calender = [
              createMonth(31), // Jan
              createMonth(28), // Feb
              createMonth(31),
              createMonth(30),
              createMonth(31),
              createMonth(30),
              createMonth(31),
              createMonth(31),
              createMonth(30),
              createMonth(31),
              createMonth(30),
              createMonth(31),
            ];
            for (let i = 0; i < body.length; i++) {
              const { checkin, duration } = body[i];
              const checkInDate = new Date(checkin);
              const month = checkInDate.getMonth(); // get 0-11
              const day = checkInDate.getDate(); // get 1-31
              for (let j = 0; j < calender[month].length; j++) {
                if (calender[month][j] === day) {
                  // can refactor lator to more accurately change duration using index and values
                  calender[month].splice(j, duration);
                }
              }
            }
            return calender;
          };

          const newAvailableDates = convertDatesIntoCalender(body);
          this.setState({
            id: body[0].id,
            price: body[0].price,
            cleaningFee: body[0].cleaningFee,
            serviceFee: body[0].serviceFee,
            minStay: body[0].minStay,
            maxGuests: body[0].maxGuests,
            availableDates: newAvailableDates,
          });
        })
        .catch((err) => { throw err; });
    }
  }

  setNextStage(newStage) {
    const { checkOutStage } = this.state;
    this.setState({
      checkOutStage: checkOutStage === newStage ? 0 : newStage,
      isSelectingGuests: false,
      showPopUpInfo: 0,
    });
  }

  // handle date selection
  setSelectedDate(selectedDate) {
    const {
      requestedDates,
      month,
      year,
    } = this.state;

    let { checkOutStage } = this.state;

    if (requestedDates[0] === undefined) {
      requestedDates[0] = new Date(year, month, selectedDate);
    } else if (requestedDates[1] === undefined) {
      requestedDates[1] = new Date(year, month, selectedDate);
    }
    if (requestedDates[0] && requestedDates[1]) {
      checkOutStage = 3;
    } else {
      checkOutStage = 2;
    }
    this.setState({
      requestedDates,
      checkOutStage,
    });
  }

  getCalendarTitle(titleStage) {
    const { requestedDates, checkOutStage } = this.state;
    const titles = ['Check-in', 'Check-out'];
    let classNames = '';
    let text = '';
    // check if title respective date has been selected
    if (requestedDates[titleStage] === undefined) {
      text = titles[titleStage];
    } else {
      text = `${requestedDates[titleStage].getMonth() + 1}/${requestedDates[titleStage].getDate()}/${requestedDates[titleStage].getFullYear()}`;
    }
    if (checkOutStage === titleStage + 1) {
      classNames = styles.currentStage;
    }
    return (
      <p
        className={classNames}
        id={`${titles[titleStage].toLowerCase()}`}
        onClick={() => this.setNextStage(titleStage + 1)}
      >
        {text}
      </p>);
  }

  clearDates() {
    this.setState({
      checkOutStage: 1,
      requestedDates: [],
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    });
  }

  // handles moving the calendar to the next or previous month
  changeMonth(i) {
    const { month, year } = this.state;
    let newMonth = month + i;
    let newYear = year;
    if (newMonth === 12) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth === -1) {
      newMonth = 11;
      newYear -= 1;
    }
    this.setState({
      year: newYear,
      month: newMonth,
    });
  }

  updateGuestCount(type, num) {
    const { guestCount } = this.state;
    guestCount[type] += num;
    this.setState({
      guestCount,
    });
  }

  toggleGuestSelectView() {
    const { isSelectingGuests } = this.state;
    const newStatus = !isSelectingGuests;
    this.setState({
      isSelectingGuests: newStatus,
      showPopUpInfo: 0,
    });
  }

  toggleInfoPopUp(popUpId) {
    const { showPopUpInfo } = this.state;
    if (showPopUpInfo === popUpId) {
      this.setState({
        showPopUpInfo: 0,
      });
    } else {
      this.setState({
        showPopUpInfo: popUpId,
      });
    }
  }

  submitRequest() {
    const {
      requestedDates,
      id,
      checkOutStage,
      displayBreakpoint,
    } = this.state;
    let { displayModalView } = this.state;
    if (window.innerWidth < displayBreakpoint && !displayModalView) {
      displayModalView = true;
      this.setState({ displayModalView });
      return;
    }
    if (checkOutStage !== 3) {
      this.setState({ checkOutStage: checkOutStage === 0 ? 1 : 2 });
      return;
    }
    const currentMonth = new Date().getMonth();
    const getBookingData = (date) => {
      const month = date.getMonth();
      if (month < currentMonth) {
        return { index: currentMonth + month, date: date.getDate() };
      }
      return { index: month - currentMonth, date: date.getDate() };
    };
    const checkIn = getBookingData(requestedDates[0]);
    const checkOut = getBookingData(requestedDates[1]);

    // get array indeces from requested dates
    const reqBody = {
      id,
      checkIn,
      checkOut,
    };
    console.log("checkin", checkin);
    console.log(typeof checkin);
    console.log("checkout", checkout);

    fetch('/api/submit', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(reqBody),
    })
      .then(res => res.json())
      .then(data => this.setState({ ...data, checkOutStage: 4, requestedDates: [] }));
  }

  renderGuestTitle() {
    const { guestCount, isSelectingGuests, icons: { downArrow, upArrow } } = this.state;
    const totalGuestCount = guestCount.adults + guestCount.children;
    let output = `${totalGuestCount} guest`;
    let icon = downArrow;
    if (totalGuestCount > 1) {
      output += 's';
    }
    if (guestCount.infants > 0) {
      output += `, ${guestCount.infants} infant`;
      if (guestCount.infants > 1) {
        output += 's';
      }
    }
    if (isSelectingGuests) {
      icon = upArrow;
    }
    return (
      <div className={styles.subComponent} id="toggle-guest-view" onClick={this.toggleGuestSelectView}>
        <p>
          {output}
        </p>
        <img className={styles.icon} src={icon} alt="" />
      </div>
    );
  }

  render() {
    const {
      checkOutStage,
      isSelectingGuests,
      price,
      displayBreakpoint,
      displayModalView,
    } = this.state;

    return (
      <div className={styles.container} id="book">
        <div
          className={styles.bookingsContainer}
          style={displayModalView && displayBreakpoint > window.innerWidth ? { display: 'flex' } : null}
          id="bookings-container"
        >
          <div className={styles.bookings} id="bookings">
            <button
              className={styles.closeModalBtn}
              type="button"
              onClick={() => this.setState({ displayModalView: false })}
            >
              &times;
            </button>
            <p>
              <span className={styles.price}>
                {`$${price} `}
              </span>
              per night
            </p>
            <hr />
            <CalendarTitle renderTitle={this.getCalendarTitle} {...this.state} />
            {(checkOutStage === 1 || checkOutStage === 2)
              && (
                <Calendar
                  {...this.state}
                  changeMonth={this.changeMonth}
                  selectDate={this.setSelectedDate}
                  clearDates={this.clearDates}
                />
              )
            }
            {this.renderGuestTitle.call(this)}
            {isSelectingGuests
              && (
                <Guests
                  {...this.state}
                  updateGuestCount={this.updateGuestCount}
                  toggleView={this.toggleGuestSelectView}
                />
              )
            }
            {checkOutStage === 3 && (
              <Pricing
                {...this.state}
                toggleInfo={this.toggleInfoPopUp}
              />
            )}
            <SubmitBtn submitRequest={this.submitRequest} className={styles.bookBtn} />
            <p className={styles.text}>
              {checkOutStage !== 4 ? (
                'You won\'t be charged'
              ) : (
                <span className={styles.successMsg}>
                  Your request was successfully submitted. The host will contact you shortly.
                </span>
              )}
            </p>
          </div>
        </div>
        <div
          className={styles.footerView}
          style={displayModalView && displayBreakpoint > window.innerWidth ? { display: 'none' } : null}
          id="footer-view"
        >
          <p className={styles.footerPrice}>
            <span className={styles.price}>
              {`$${price} `}
            </span>
            per night
          </p>
          <SubmitBtn submitRequest={this.submitRequest} className={styles.footerSubmitBtn} />
        </div>
      </div>
    );
  }
}
