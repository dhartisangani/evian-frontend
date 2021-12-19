import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import styles from "./Dashboard.module.css";

import Navbar from "../../Components/Navbar";
import SlotHistory from "../../Components/Dashboard/LeftSection/SlotHistory";
import Highlight from "../../Components/Dashboard/RightSection/Highlight";
import PaymentHistory from "../../Components/Dashboard/RightSection/PaymentHistory";

import { getStationDashboardData } from "../../Services/station.service";
import { getStationDataById } from "./../../Services/station.service";

const selectColorStyles = {
  control: (styles) => ({
    ...styles,
    fontSize: "var(--font-16)",
    border: "1px solid black",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      fontSize: "var(--font-16)",
      transition: "background-color 0.1s ease",
      ":active": {
        ...styles[":active"],
        // backgroundColor: "var(--orange-tertiary)",
      },
      ":hover": {
        ...styles[":hover"],
        // backgroundColor: "var(--orange-tertiary)",
      },
      ":visited": {
        ...styles[":visited"],
        // backgroundColor: "var(--orange-tertiary)",
      },
    };
  },
};

const PointOptions = [
  { value: "1", label: "Point 1" },
  { value: "2", label: "Point 2" },
  { value: "3", label: "Point 3" },
];

function Dashboard() {
  const userData = useSelector((state) => state.userReducer.userData);

  const [bookingsData, setBookingsData] = React.useState(null);

  const [highlightData, setHighlightData] = React.useState([0, 0, 0]);
  const [todaysOrders, setTodaysOrders] = React.useState(null);

  const [currentActivePoint, setCurrentActivePoint] = React.useState(0);
  const [chargingPointsData, setChargingPointsData] = React.useState([]);
  const [pointOptions, setPointOptions] = React.useState([]);

  useEffect(async () => {
    try {
      let data = await getStationDashboardData(userData.accessToken);
      data = data.bookings;
      data = data.map((order) => {
        return {
          ...order,
          startDate: new Date(order.createdAt._seconds * 1000),
        };
      });
      setBookingsData(data);

      let chargingPointsData = await getStationDataById(userData.uid);

      chargingPointsData = chargingPointsData.chargingPoints.map((_, index) => {
        return {
          value: index + 1,
          label: `Point ${index + 1}`,
        };
      });
      setPointOptions(chargingPointsData);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (bookingsData) {
      const tmpTodaysOrders = bookingsData.filter(
        (order) =>
          order.startDate.getDate() === new Date().getDate() &&
          order.startDate.getMonth() === new Date().getMonth() &&
          order.startDate.getFullYear() === new Date().getFullYear()
      );
      setTodaysOrders(tmpTodaysOrders);

      let totalOrders = bookingsData?.length;
      let totalEarnings = bookingsData?.reduce((acc, curr) => {
        return acc + curr.totalAmount;
      }, 0);
      let totalEarningInLastMonth = bookingsData?.reduce((acc, curr) => {
        if (
          curr.startDate.getMonth() === new Date().getMonth() &&
          curr.startDate.getFullYear() === new Date().getFullYear()
        ) {
          return acc + curr.totalAmount;
        }
        return acc;
      }, 0);
      setHighlightData([totalOrders, totalEarnings, totalEarningInLastMonth]);
    }
  }, [bookingsData]);
  return (
    <>
      <Navbar />

      <div className={styles.Wrapper}>
        <div className={styles.LeftWrapper}>
          <div className={styles.HeadingWrapper}>Today's Booking</div>
          <div className={styles.SelectorWrapper}>
            <Select
              closeMenuOnSelect={false}
              styles={selectColorStyles}
              options={pointOptions}
              onChange={(newElem) => {
                setCurrentActivePoint(parseInt(newElem.value));
              }}
              value={pointOptions[currentActivePoint - 1]}
            />
          </div>
          <div className={styles.SlotListWrapper}>
            <SlotHistory
              booingsData={todaysOrders}
              currentActivePoint={currentActivePoint}
            />
          </div>
        </div>

        <div className={styles.RightWrapper}>
          <div className={styles.HighlightWrapper}>
            <Highlight highlightData={highlightData} />
          </div>
          <div className={styles.PaymentHistoryWrapper}>
            <PaymentHistory paymentData={bookingsData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
