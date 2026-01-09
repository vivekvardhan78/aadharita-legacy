import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string | Date;
  glowColor?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ targetDate, glowColor = '#00f0ff' }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div 
            className="glass-card p-3 sm:p-5 w-[70px] sm:w-[90px] md:w-[100px] text-center animate-pulse-neon"
            style={{
              boxShadow: `0 0 20px ${glowColor}30, inset 0 0 20px ${glowColor}10`,
              borderColor: `${glowColor}50`,
            }}
          >
            <div 
              className="font-orbitron text-2xl sm:text-4xl font-black"
              style={{
                color: glowColor,
                textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}60`,
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="font-rajdhani text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mt-1">
              {unit.label}
            </div>
          </div>
          {index < timeUnits.length - 1 && (
            <span 
              className="font-orbitron text-2xl sm:text-3xl font-bold animate-pulse"
              style={{ color: glowColor }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
