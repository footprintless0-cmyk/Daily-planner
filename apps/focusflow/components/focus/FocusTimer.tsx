'use client';

import { useState, useEffect, useRef } from 'react';

interface FocusTimerProps {
  onTimerComplete: (sessionData: any) => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onTimerComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useState<'pomodoro' | 'custom'>('pomodoro');
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [customBreak, setCustomBreak] = useState<number>(5);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      handleTimerComplete();
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    if (mode === 'pomodoro') {
      setTimeLeft(25 * 60); // Reset to 25 minutes
      setIsBreak(false);
    } else {
      setTimeLeft(customMinutes * 60); // Reset to custom time
    }
  };

  const handleSetCustomTime = () => {
    setTimeLeft(customMinutes * 60);
    setIsBreak(false);
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    
    // Create session data
    const sessionData = {
      type: mode === 'pomodoro' ? 'Pomodoro' : 'Custom',
      plannedMins: mode === 'pomodoro' ? 25 : customMinutes,
      actualMins: mode === 'pomodoro' ? 25 : customMinutes,
      notes: sessionNotes,
      completed: true,
    };

    // Call the callback to save the session
    onTimerComplete(sessionData);

    // If it was a work session, start the break
    if (!isBreak && mode === 'pomodoro') {
      setIsBreak(true);
      setTimeLeft(customBreak * 60);
      setIsActive(true); // Automatically start the break
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const totalSeconds = mode === 'pomodoro' 
    ? (isBreak ? customBreak * 60 : 25 * 60) 
    : customMinutes * 60;
  const progress = totalSeconds > 0 
    ? 100 - (timeLeft / totalSeconds) * 100 
    : 0;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          {isBreak ? 'Break Time' : mode === 'pomodoro' ? 'Pomodoro Timer' : 'Custom Timer'}
        </h2>
        
        {/* Timer circle with progress */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isBreak ? "#10b981" : "#3b82f6"} // Green for break, blue for work
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="283" // Circumference: 2 * π * r (r=45)
              strokeDashoffset={283 - (283 * progress) / 100}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex justify-center space-x-4 mb-6">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Start timer"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              aria-label="Pause timer"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Reset timer"
          >
            Reset
          </button>
        </div>

        {/* Mode selection */}
        <div className="mb-6">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => {
                setMode('pomodoro');
                setTimeLeft(25 * 60);
                setIsBreak(false);
              }}
              className={`px-4 py-2 rounded-md ${
                mode === 'pomodoro'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => {
                setMode('custom');
                setTimeLeft(customMinutes * 60);
              }}
              className={`px-4 py-2 rounded-md ${
                mode === 'custom'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Custom
            </button>
          </div>

          {mode === 'custom' && (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 25)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Work minutes"
                />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={customBreak}
                  onChange={(e) => setCustomBreak(parseInt(e.target.value) || 5)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Break minutes"
                />
              </div>
              <button
                onClick={handleSetCustomTime}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Set Time
              </button>
            </div>
          )}
        </div>

        {/* Session notes */}
        <div className="mb-6">
          <label htmlFor="session-notes" className="block text-sm font-medium text-gray-700 mb-2">
            Session Notes
          </label>
          <textarea
            id="session-notes"
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="How did the session go?"
          />
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;