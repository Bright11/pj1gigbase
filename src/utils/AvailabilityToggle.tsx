import { Mycolors } from '@/constants/mycolors';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

interface AvailabilityToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function AvailabilityToggle({
  value,
  onChange,
  disabled = false,
}: AvailabilityToggleProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Availability
        </Text>

        <Text style={styles.status}>
          {value ? 'Available' : 'Unavailable'}
        </Text>
      </View>

      <Pressable
        disabled={disabled}
        onPress={() => onChange(!value)}
        style={[
          styles.track,
          value && styles.trackActive,
          disabled && styles.disabled,
        ]}
      >
        <View
          style={[
            styles.thumb,
            value && styles.thumbActive,
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor:Mycolors.whitecolor,
    width:'100%'
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  status: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.6,
  },

  track: {
    width: 52,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  trackActive: {
    backgroundColor: Mycolors.primarycolor,
  },

  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },

  thumbActive: {
    alignSelf: 'flex-end',
  },

  disabled: {
    opacity: 0.5,
  },
});