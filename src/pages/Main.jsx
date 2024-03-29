import React, { useState, useEffect } from "react";
import axios from 'axios';
import {useSelector,useDispatch} from 'react-redux'
import "./Main.css";
import Day from "../components/Day";
import { userActions } from '../redux/slices/userSlice';
import {tokenActions} from'../redux/slices/tokenSlice';
import { ReactComponent as ReservationCancelRequest } from '../icons/reservation-cancel-request.svg';
import { ReactComponent as ReservationRequest } from '../icons/reservation-request.svg';
import { ReactComponent as ReservationCancelConfirm } from '../icons/reservation-cancel-confirm.svg';
import { ReactComponent as ReservationConfirm } from '../icons/reservation-confirm.svg';
import { ReactComponent as ReservationCompleted } from '../icons/reservation-completed.svg';
import { ReactComponent as ReservationIng } from '../icons/reservation-ing.svg';
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [datesArray, setDatesArray] = useState("");
  const [reservationData,setReservationData] = useState([])
  const date = new Date();
  const MONTH = date.getMonth();
  const [month, setMonth] = useState(MONTH + 1);
  const YEAR = date.getFullYear();
  const [year, setYear] = useState(YEAR);
  const LastDay = new Date(year, month, 0).getDate()
  const email = useSelector((state) => state.persist.user.user.email);
  const dispatch = useDispatch();
  const navigate = useNavigate() 

  useEffect(() => {
    bookingGetData()
  }, [year,month]);

  useEffect(() => {
    renderCalendar();
  }, [reservationData]);

  const bookingGetData = async () => {
    let month_;
    if (month < 10) {
      month_ = `0${month}`;
    } else {
      month_ = month.toString();
    }
    const startDt = `${year}-${month_}-01`;
    const endDt = `${year}-${month_}-${LastDay}`;
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_API_URL}/pms/booking/getData?startDt=${startDt}&endDt=${endDt}`
      );
      setReservationData(result.data.data);
      console.log(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderCalendar = () => {
    if (month === 13) {
      setMonth(1);
      setYear(year + 1);
    } else if (month === 0) {
      setMonth(12);
      setYear(year - 1);
    }

    document.querySelector(".year-month").textContent = `${year}년 ${month}월`;

    const prevLast = new Date(year, month - 1, 0);
    const thisLast = new Date(year, month, 0);

    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    const nextDates = [];

    if (PLDay !== 6) {
      for (let i = 0; i < PLDay + 1; i++) {
        prevDates.unshift(PLDate - i);
      }
    }
    for (let i = 1; i < 7 - TLDay; i++) {
      nextDates.push(i);
    }

    const dates = prevDates.concat(thisDates, nextDates);

    let datesElement;
    if (reservationData!==null) {
      datesElement = dates.map((day, i) => {
        if (i < prevDates.length) {
          return (
            <div className="date" key={i}>
              <Day day={day} reservationData={[]} />
            </div>
          );
        } else {
          return (
            <div className="date" key={i}>
              <Day
                day={day}
                reservationData={reservationData[i - prevDates.length]}
              />
            </div>
          );
        }
      });
    }
    setDatesArray(datesElement);
  };

  const prevMonth = () => {
    setMonth(month - 1);  
  };

  const nextMonth = () => {
    setMonth(month + 1);
  };

  const goToday = () => {
    const date = new Date();
    const YEAR = date.getFullYear();
    setYear(YEAR)
    setMonth(MONTH + 1);
  };

  const logoutHandler = () => {
    dispatch(
      userActions.signout(),
      tokenActions.tokenInitialization()
    );
    localStorage.removeItem('refreshToken');
  }

  const moveToMungPlaceRegistrationPage = () => {
    navigate("mungple")
  }

  return (
    <div>
      <div>
        <div className="id">{email}</div>
        <div className="logout" onClick={logoutHandler}>로그아웃</div>
        <div className="logout" onClick={moveToMungPlaceRegistrationPage}>멍플등록</div>
      </div>
      <div className="body">
        <div className="calendar">
          <div className="header">
            <div className="year-month"></div>
            <div>
              <ReservationRequest />
              <ReservationConfirm  />
              <ReservationCancelRequest />
              <ReservationCancelConfirm />
              <ReservationIng />
              <ReservationCompleted  />
            </div>
            <div className="nav">
              <button className="nav-btn go-prev" onClick={prevMonth}>
                &lt;
              </button>
              <button className="nav-btn go-today" onClick={goToday}>
                이번달
              </button>
              <button className="nav-btn go-next" onClick={nextMonth}>
                &gt;
              </button>
            </div>
          </div>
          <div className="main">
            <div className="days">
              <div className="day sunday">일</div>
              <div className="day">월</div>
              <div className="day">화</div>
              <div className="day">수</div>
              <div className="day">목</div>
              <div className="day">금</div>
              <div className="day saturday">토</div>
            </div>
            <div className="dates">{datesArray}</div>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};

export default Main;
