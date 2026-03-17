import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import { FONT } from '../../theme/fonts';
import { FONTSIZE, WIDTH, HEIGHT } from '../../utils/responsive';

const ToggleTabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === 'project' && styles.activeTab,
        ]}
        onPress={() => setSelectedTab('project')}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === 'project' && styles.activeText,
          ]}
        >
          Project
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === 'enquiry' && styles.activeTab,
        ]}
        onPress={() => setSelectedTab('enquiry')}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === 'enquiry' && styles.activeText,
          ]}
        >
          General Enquiry
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ToggleTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderRadius: 22,
    marginHorizontal: WIDTH(4),
    marginVertical: HEIGHT(2),
    padding: 6,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    color: '#333',
    fontWeight: '400',
  },

  activeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    fontWeight: '400',
  },
});
