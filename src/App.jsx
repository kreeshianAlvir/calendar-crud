import "./App.css";
import moment from "moment";
import _ from "lodash";
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
import dayjs from "dayjs";

const weekDaysName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const createUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

function App() {
  const [currentCalendar, setCurrentCalendar] = useState({
    month: moment().get("month"),
    year: moment().get("year"),
  });
  const [calendarDates, setCalendarDates] = useState([]);
  const [events, setEvents] = useState([
    {
      id: createUniqueId(),
      date: moment().format("MMMM D, YYYY"),
      eventList: [
        {
          id: createUniqueId(),
          title: "sample event",
          description: "a sample event",
          time: moment().format("HH:mm a"),
        },
      ],
    },
  ]);
  const [eventDetails, setEventDetails] = useState({
    date: moment().format("MMMM D, YYYY"),
    title: "",
    description: "",
    time: moment().format("HH:mm a"),
  });

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

  const DateEventList = (date) => {
    const event = events.find((n) => n.date === date);

    if (event) {
      const eventLimit = 2;
      return (
        <Box className="events">
          {event.eventList.slice(0, eventLimit).map((item, key) => (
            <Chip
              label={item.title}
              className="event-title"
              key={key}
              onClick={() => {
                setEventDetails({
                  dateId: event.id,
                  eventId: item.id,
                  date: moment(date).format("MM/DD/YYYY"),
                  title: item.title,
                  description: item.description,
                  time: moment(
                    `${date} ${item.time.match(/\d+:\d+/g)[0]}`
                  ).format("HH:mm a"),
                });
              }}
              onDelete={() => {
                handleDeleteEvent(event.id, item.id);
              }}
            />
          ))}
          {event.eventList.length > eventLimit && (
            <Chip
              label={`${event.eventList.length - eventLimit} More`}
              style={{ borderRadius: "4px" }}
            />
          )}
        </Box>
      );
    }
  };

  const handleCreateUpdateEvent = () => {
    const { dateId, eventId, date, title, description, time } = eventDetails;
    const list = _.cloneDeep(events);

    const addEvent = () => {
      const dateExisting = list.find((n) => n.date === date);

      if (dateExisting) {
        dateExisting.eventList.push({
          id: createUniqueId(),
          title,
          description,
          time,
        });
      } else {
        list.push({
          id: createUniqueId(),
          date,
          eventList: [{ id: createUniqueId(), title, description, time }],
        });
      }
    };

    // check the dateId if undefined
    if (dateId) {
      const currentDateDetails = list.find((n) => n.id === dateId);
      if (currentDateDetails.date === date) {
        currentDateDetails.eventList.push({
          id: createUniqueId(),
          title,
          description,
          time,
        });
      } else {
        // check if the event is moved to another date
        if (currentDateDetails.date === date) {
          const event = currentDateDetails.eventList.find(
            (n) => n.id === eventId
          );

          event.title = title;
          event.description = description;
          event.time = time;
        } else {
          addEvent();

          // delete the event
          const dateIndex = list.findIndex((n) => n.id === dateId);
          const eventIndex = list[dateIndex].eventList.findIndex(
            (n) => n.id === eventId
          );
          list[dateIndex].eventList.splice(eventIndex, 1);

          // remove the date event if the date events are empty
          if (list[dateIndex].eventList.length === 0) {
            list.splice(dateIndex, 1);
          }
        }
      }
    } else {
      addEvent();
    }

    setEvents(list);
    handleResetFields();
  };

  const handleResetFields = () => {
    setEventDetails({
      date: moment().format("MMMM D, YYYY"),
      title: "",
      description: "",
      time: moment().format("HH:mm a"),
    });
  };

  const handleDeleteEvent = (dateId, eventId) => {
    const list = _.cloneDeep(events);
    const dateIndex = list.findIndex((n) => n.id === dateId);
    const eventIndex = list[dateIndex].eventList.findIndex(
      (n) => n.id === eventId
    );

    // delete the event
    list[dateIndex].eventList.splice(eventIndex, 1);

    // remove the date event if the date events are empty
    if (list[dateIndex].eventList.length === 0) {
      list.splice(dateIndex, 1);
    }

    setEvents(list);
  };

  return (
    <Box>
      <Typography variant="h5">Event Setter</Typography>
      <Paper className="form-paper" elevation={0}>
        <Box>
          <Box className="form-item">
            <Typography variant="subtitle1">Title</Typography>
            <TextField
              value={eventDetails.title}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, title: e.target.value })
              }
            />
          </Box>
          <Box className="form-item">
            <Typography variant="subtitle1">Description</Typography>
            <TextField
              maxRows={5}
              multiline
              rows={5}
              fullWidth
              value={eventDetails.description}
              onChange={(e) =>
                setEventDetails({
                  ...eventDetails,
                  description: e.target.value,
                })
              }
            />
          </Box>
        </Box>
        <Box>
          <Box className="form-item">
            <Typography variant="subtitle1">Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dayjs(moment(eventDetails.date))}
                onChange={(newValue) =>
                  setEventDetails({
                    ...eventDetails,
                    date: newValue.format("MMMM D, YYYY"),
                  })
                }
                minDate={dayjs(moment().format("YYYY-MM-DD"))}
              />
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
                value={dayjs(
                  moment(
                    `${eventDetails.date} ${
                      eventDetails.time.match(/\d+:\d+/g)[0]
                    }`
                  ).format(`MM/DD/YYYY hh:mm a`)
                )}
                onChange={(newValue) =>
                  setEventDetails({
                    ...eventDetails,
                    time: newValue.format("hh:mm a"),
                  })
                }
                minTime={dayjs(moment().format("YYYY-MM-DD hh:mm a"))}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={0} className="form-paper form-action">
        <Button variant="outlined" onClick={handleResetFields}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleCreateUpdateEvent}
        >
          {eventDetails.dateId ? "Update" : "Save"}
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
                    {DateEventList(
                      moment().set(currentCalendar).format(`MMMM ${d}, YYYY`)
                    )}
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
