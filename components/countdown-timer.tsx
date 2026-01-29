import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DesignColors } from '@/constants/design-colors';

interface CountdownTimerProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeRemaining.isExpired) {
    return (
      <View style={styles.container}>
        <Text style={styles.expiredText}>Tournament has started!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Time Until First Game</Text>
      <View style={styles.timeContainer}>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{timeRemaining.days}</Text>
          <Text style={styles.timeLabel}>Days</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{String(timeRemaining.hours).padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Hours</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{String(timeRemaining.minutes).padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Minutes</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{String(timeRemaining.seconds).padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Seconds</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: DesignColors.textOnDark,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeUnit: {
    alignItems: 'center',
    gap: 4,
  },
  timeValue: {
    color: DesignColors.textOnDark,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Ethnocentric',
    minWidth: 40,
    textAlign: 'center',
  },
  timeLabel: {
    color: DesignColors.textOnDark,
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.8,
  },
  separator: {
    color: DesignColors.textOnDark,
    fontSize: 20,
    fontWeight: '700',
    opacity: 0.7,
    marginBottom: 12,
  },
  expiredText: {
    color: DesignColors.textOnDark,
    fontSize: 16,
    fontWeight: '700',
  },
});
