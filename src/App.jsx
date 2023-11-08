import "./App.css";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";

const weekDaysName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function App() {
  const [currentCalendar, setCurrentCalendar] = useState({
    month: moment().get("month"),
    year: moment().get("year"),
  });
  const [calendarDates, setCalendarDates] = useState([]);

  useEffect(() => {
    const startDay = moment().set(currentCalendar).get("day");
    const lastDayOfMonth = moment()
      .set(currentCalendar)
      .endOf("month")
      .get("date");

    const weekArr = [];
    let currentDate = 1;
    // w = week
    // d = day
    for (let w = 0; w < 6; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        let date = currentDate;
        if (date <= lastDayOfMonth) {
          if (w === 0) {
            if (d < startDay) {
              date = "";
            } else {
              currentDate++;
            }
          } else {
            currentDate++;
          }
        } else {
          date = "";
        }

        week.push(date);
      }
      weekArr.push(week);
    }

    setCalendarDates(weekArr);
  }, [currentCalendar]);

  const handleNavigateCalendar = (dir) => {
    switch (dir) {
      case "previous-year":
        setCurrentCalendar({
          ...currentCalendar,
          year: currentCalendar.year - 1,
        });
        break;
      case "previous-month":
        setCurrentCalendar({
          ...currentCalendar,
          month: currentCalendar.month - 1,
        });
        break;
      case "next-month":
        setCurrentCalendar({
          ...currentCalendar,
          month: currentCalendar.month + 1,
        });
        break;
      case "next-year":
        setCurrentCalendar({
          ...currentCalendar,
          year: currentCalendar.year + 1,
        });
        break;
    }
  };

  return (
    <Box>
      <Typography variant="h5">Event Setter</Typography>
      <Paper className="form-paper" elevation={0}>
        <Box>
          <Box className="form-item">
            <Typography variant="subtitle1">Title</Typography>
            <TextField />
          </Box>
          <Box className="form-item">
            <Typography variant="subtitle1">Description</Typography>
            <TextField maxRows={5} multiline rows={5} fullWidth />
          </Box>
        </Box>
        <Box>
          <Box className="form-item">
            <Typography variant="subtitle1">Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker />
            </LocalizationProvider>
          </Box>
          <Box className="form-item">
            <Typography variant="subtitle1">Time</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={0} className="form-paper form-action">
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained" disableElevation>
          Save
        </Button>
      </Paper>
      <Divider style={{ margin: "10px 0px" }} />
      <Box className="calendar-header">
        <Typography variant="h5">{`${moment()
          .set(currentCalendar)
          .format("MMMM")} ${currentCalendar.year}`}</Typography>
        <Box className="calendar-navigation">
          <Button
            variant="contained"
            disableElevation
            onClick={() => handleNavigateCalendar("previous-year")}
          >
            <KeyboardDoubleArrowLeft />
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => handleNavigateCalendar("previous-month")}
          >
            <KeyboardArrowLeft />
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => handleNavigateCalendar("next-month")}
          >
            <KeyboardArrowRight />
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => handleNavigateCalendar("next-year")}
          >
            <KeyboardDoubleArrowRight />
          </Button>
        </Box>
      </Box>
      <Paper elevation={0} className="calendar">
        <Box className="week-names">
          {weekDaysName.map((item) => (
            <Box key={item} className="week-days">
              {item}
            </Box>
          ))}
        </Box>
        {calendarDates.map((w, wkey) => (
          <Box key={`week-${wkey}`} className="week">
            {w.map((d, dkey) => (
              <Box key={`day-${dkey}`} className="day">
                {d !== "" && (
                  <>
                    <Typography variant="h6">{d}</Typography>
                    <Box className="events">
                      <Chip
                        label="The following two divs contains a text that will not fit in the box."
                        className="event-title"
                      />
                      <Chip
                        label="The following two divs contains a text that will not fit in the box."
                        className="event-title"
                      />
                      <Chip
                        label="The following two divs contains a text that will not fit in the box."
                        className="event-title"
                      />
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

export default App;
