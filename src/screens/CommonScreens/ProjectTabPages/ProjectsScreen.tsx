import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTSIZE, HEIGHT, WIDTH } from '../../../utils/responsive';
import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';
import { useNavigation } from '@react-navigation/native';

import PlusIcon from '../../../assets/svgs/PlusIcon.svg';
import DeleteIcon from '../../../assets/svgs/Delete.svg';
import ScreenHeader from '../../../components/ScreenHeader';
import CustomPopup from '../../../components/Popups/CustomPopup';

const projects = [
  {
    id: '1',
    name: 'ABC complex',
    code: '#C82922787',
    status: 'Active',
    image: require('../../../assets/pngs/BannerImg.png'),
  },
  {
    id: '2',
    name: 'ABC complex',
    code: '#C82922787',
    status: 'Active',
    image: require('../../../assets/pngs/BannerImg.png'),
  },
  {
    id: '3',
    name: 'My house',
    code: '#C82956787',
    status: 'Closed',
    image: require('../../../assets/pngs/BannerImg.png'),
  },
];

const ProjectsScreen = ({ route }: any) => {
  const navigation = useNavigation();

  // coming from API
  const userType = 'customer'; // 'professional'

  const isCustomer = userType === 'customer';

  const [deletePopupVisible, setDeletePopupVisible] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('CommonProjectDetails', { project: item })
        }
      >
        <View style={styles.card}>
          <Image source={item.image} style={styles.projectImage} />

          {isCustomer && (
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => {
                setSelectedProject(item);
                setDeletePopupVisible(true);
              }}
            >
              <DeleteIcon width={25} height={25} />
            </TouchableOpacity>
          )}

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.projectName}>{item.name}</Text>
              <Text style={styles.projectCode}>{item.code}</Text>
            </View>

            {isCustomer && (
              <Text
                style={[
                  styles.status,
                  item.status === 'Closed'
                    ? styles.closedStatus
                    : styles.activeStatus,
                ]}
              >
                {item.status}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Projects" showBack />
      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: WIDTH(4),
          paddingBottom: HEIGHT(10),
        }}
      />

      {/* Add Button only for customer */}
      {isCustomer && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProjectInformation')}
        >
          <PlusIcon width={24} height={24} />
        </TouchableOpacity>
      )}

      <CustomPopup
        visible={deletePopupVisible}
        message="Are you sure you want to delete this project?"
        onClose={() => setDeletePopupVisible(false)}
        buttons={[
          {
            label: 'No, Keep it',
            onPress: () => setDeletePopupVisible(false),
          },
          {
            label: 'Yes, Delete!',
            type: 'primary',
            onPress: () => {
              setDeletePopupVisible(false);
            },
          },
        ]}
      />
    </View>
  );
};

export default ProjectsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    fontSize: 20,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: HEIGHT(2),
    overflow: 'hidden',
  },

  projectImage: {
    width: '100%',
    height: HEIGHT(18),
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  deleteIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'rgba(239, 239, 239, 0.25)',
    padding: 6,
    borderRadius: 20,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },

  projectName: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  projectCode: {
    fontSize: 14,

    fontFamily: FONT.POPPINS_REGULAR,
  },

  status: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  activeStatus: {
    color: '#3BA56A',
  },

  closedStatus: {
    color: '#999',
  },

  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#3BA56A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
