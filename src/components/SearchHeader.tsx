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
import { FONT } from '../theme/fonts';
import { useSelector } from 'react-redux';
import { IMG_URL } from '../apis/ApiManager';

interface Props {
  value?: string;
  onChangeText?: (text: string) => void;
  onProfilePress?: () => void;
  placeholder?: string;
  showProfile?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchHeader: React.FC<Props> = ({
  value,
  onChangeText,
  onProfilePress,
  placeholder = 'Search',
  showProfile = true,
  style,
  containerStyle,
  onFocus,
  onBlur,
}) => {
  const user = useSelector(state => state.auth.user);
  const profileImage = user?.image;
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
          onFocus={onFocus}
          placeholderTextColor="#757575"
          onBlur={onBlur}
        />
      </View>

      {/* Profile Avatar */}
      {showProfile && (
        <TouchableOpacity onPress={onProfilePress}>
          <Image
            source={
              profileImage
                ? { uri: `${IMG_URL}${profileImage}` }
                : require('../assets/pngs/Placeholder.png')
            }
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
    // marginTop: 50,
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
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.primary,
  },

  input: {
    marginLeft: 8,
    color: '#000',
    flex: 1,
    fontSize: 16,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    justifyContent: 'center',
    paddingVertical: 0,
    includeFontPadding: false, // Android fix
    textAlignVertical: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
});
