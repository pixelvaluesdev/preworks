import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import SearchIcon from '../assets/svgs/Search.svg';
import { WIDTH } from '../utils/responsive';
import Colors from '../constants/colors';

interface Props {
  value?: string;
  onChangeText?: (text: string) => void;
  onProfilePress?: () => void;
  placeholder?: string;
  showProfile?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

const SearchHeader: React.FC<Props> = ({
  value,
  onChangeText,
  onProfilePress,
  placeholder = 'Search',
  showProfile = true,
  style,
  containerStyle,
}) => {
  return (
    <View
      style={[
        styles.container,
        !showProfile && styles.fullWidth,
        containerStyle,
      ]}
    >
      {/* Search Bar */}
      <View style={[styles.searchBar, style]}>
        <SearchIcon width={22} height={22} />

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholderTextColor="#777"
        />
      </View>

      {/* Profile Avatar */}
      {showProfile && (
        <TouchableOpacity onPress={onProfilePress}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/men/32.jpg',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: WIDTH(5),
  },

  fullWidth: {
    justifyContent: 'center',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    flex: 1,
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 15,
  },

  input: {
    marginLeft: 8,
    flex: 1,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
});
