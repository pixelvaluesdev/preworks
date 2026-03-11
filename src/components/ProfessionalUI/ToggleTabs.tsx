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
        <TouchableOpacity>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'enquiry' && styles.activeText,
            ]}
          >
            General Enquiry
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default ToggleTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    marginHorizontal: WIDTH(4),
    marginVertical: HEIGHT(2),
    padding: 6,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    fontSize: FONTSIZE(1.6),
    fontFamily: FONT.POPPINS_MEDIUM,
    color: '#333',
    fontWeight: '400',
  },

  activeText: {
    color: '#FFFFFF',
    fontSize: FONTSIZE(1.6),
    fontFamily: FONT.POPPINS_MEDIUM,
    fontWeight: '400',
  },
});
