
import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface BookingCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

export default function BookingCalendar({
  value,
  onChange,
}: BookingCalendarProps) {
  const [showPicker, setShowPicker] = useState(false);
  

  const handleChange = (
    event: any,
    selectedDate?: Date,
  ) => {
    setShowPicker(false);

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formattedDate = value
    ? value.toLocaleDateString()
    : 'Select event date';

  return (
    <View>
      <Text style={styles.label}>
        Event Date
      </Text>

      <Pressable
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text
          style={[
            styles.dateText,
            !value && styles.placeholder,
          ]}
        >
          {formattedDate}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  dateButton: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 20,
  },

  dateText: {
    fontSize: 16,
  },

  placeholder: {
    color: '#999',
  },
});

