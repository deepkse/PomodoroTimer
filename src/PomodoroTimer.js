import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
      <Typography variant="h2" gutterBottom sx={{
        fontFamily: "Playwrite CU, cursive"
      }}>
        Pomodoro Timer
      </Typography>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={(time / (25 * 60)) * 100}
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
    </Box>
  );
};

export default PomodoroTimer;