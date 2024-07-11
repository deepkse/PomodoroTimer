import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';

const PomodoroTimer = () => {
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [time, setTime] = useState(pomodoroTime);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const pomodoroAlarmRef = useRef(null);
  const breakAlarmRef = useRef(null);

  useEffect(() => {
    pomodoroAlarmRef.current = new Audio(`${process.env.PUBLIC_URL}/times-up-take-a-break.wav`);
    breakAlarmRef.current = new Audio(`${process.env.PUBLIC_URL}/breaks-over-time-to-focus.wav`);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (isBreak) {
        setIsBreak(false);
        setTime(pomodoroTime);
        breakAlarmRef.current.play();
      } else {
        setIsBreak(true);
        setTime(breakTime);
        pomodoroAlarmRef.current.play();
      }
    }
    return () => clearInterval(interval);
  }, [isActive, time, isBreak, pomodoroTime, breakTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTime(pomodoroTime);
    pomodoroAlarmRef.current.pause();
    pomodoroAlarmRef.current.currentTime = 0;
    breakAlarmRef.current.pause();
    breakAlarmRef.current.currentTime = 0;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePomodoroTimeChange = (event) => {
    const newTime = parseInt(event.target.value) * 60;
    setPomodoroTime(newTime);
    if (!isBreak) setTime(newTime);
  };

  const handleBreakTimeChange = (event) => {
    const newTime = parseInt(event.target.value) * 60;
    setBreakTime(newTime);
    if (isBreak) setTime(newTime);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
      }}
    >
      <Typography variant="h2" gutterBottom 
        sx={{
            fontFamily: "Playwrite CU, cursive"
          }}
      >
        {isBreak ? 'Break Time' : 'Pomodoro Timer'}
      </Typography>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={(time / (isBreak ? breakTime : pomodoroTime)) * 100}
          size={200}
          thickness={4}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" component="div" color="text.secondary">
            {formatTime(time)}
          </Typography>
        </Box>
      </Box>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleTimer}
          startIcon={isActive ? <Pause /> : <PlayArrow />}
          sx={{ mr: 2 }}
        >
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={resetTimer}
          startIcon={<Refresh />}
        >
          Reset
        </Button>
      </Box>
      <Box mt={4} display="flex" justifyContent="center" alignItems="center">
        <TextField
          label="Pomodoro (mins)"
          type="number"
          value={pomodoroTime / 60}
          onChange={handlePomodoroTimeChange}
          inputProps={{ min: 1, max: 60 }}
          sx={{ mr: 2, width: '150px' }}
        />
        <TextField
          label="Break (mins)"
          type="number"
          value={breakTime / 60}
          onChange={handleBreakTimeChange}
          inputProps={{ min: 1, max: 30 }}
          sx={{ width: '150px' }}
        />
      </Box>
    </Box>
  );
};

export default PomodoroTimer;