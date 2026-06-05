import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONT } from '../../theme/fonts';
import DownArrow from '../../assets/svgs/downArrow.svg';
import Colors from '../../constants/colors';

interface BorderDropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (val: string) => void;
}

const BorderDropdown: React.FC<BorderDropdownProps> = ({
  label,
  value,
  options,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  const isFocused = open;

  return (
    <View style={styles.wrapper}>
      {/* FLOATING LABEL */}
      <Text style={styles.label}>
        {label}
        <Text style={styles.asterisk}> *</Text>
      </Text>

      {/* DROPDOWN BOX */}
      <TouchableOpacity
        style={[styles.dropdown, isFocused && styles.focusedDropdown]}
        onPress={() => setOpen(!open)}
      >
        <Text
          style={{
            color: value ? '#474747' : '#a6a6a6',
            fontFamily: FONT.POPPINS_REGULAR,
            fontSize: 16,
          }}
        >
          {value || 'Select'}
        </Text>
        <DownArrow />
      </TouchableOpacity>

      {/* OPTIONS */}
      {open && (
        <View style={styles.list}>
          {options.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.item}
              onPress={() => {
                onSelect(item);
                setOpen(false);
              }}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default BorderDropdown;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: 20,
  },

  label: {
    position: 'absolute',
    top: -8,
    left: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
    zIndex: 1,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  dropdown: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',

    borderColor: '#E2E2E2',
    borderWidth: 1.2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,

    elevation: 2,
  },

  arrow: {
    color: '#777',
  },

  list: {
    marginTop: 5,
    borderWidth: 0.75,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  item: {
    padding: 14,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  asterisk: {
    color: 'red',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
  optionText: {
    fontFamily: FONT.POPPINS_REGULAR,
    fontSize: 14,
    color: '#474747',
  },
  focusedDropdown: {
    borderColor: Colors.primary,
    borderWidth: 1,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,

    elevation: 10,

    backgroundColor: '#FFFFFF',
  },
});
