import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../../utils/responsive';
import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';
import { useNavigation } from '@react-navigation/native';

import PlusIcon from '../../../assets/svgs/PlusIcon.svg';
import DeleteIcon from '../../../assets/svgs/Delete.svg';
import ScreenHeader from '../../../components/ScreenHeader';
import CustomPopup from '../../../components/Popups/CustomPopup';
import { useSelector } from 'react-redux';
import ApiManager from '../../../apis/ApiManager';
import { BASE_URL, IMG_URL } from '../../../apis/ApiManager';
import OptionsIcon from '../../../assets/svgs/ThreeDotsIcon.svg';

const ProjectsScreen = ({ route }: any) => {
  const navigation = useNavigation();

  const userType = useSelector((state: any) => state.auth.userType);
  const token = useSelector((state: any) => state.auth.userToken);
  const user = useSelector((state: any) => state.auth.user);
  const userId = user?._id;

  const isCustomer = userType === 'customer';

  const [deletePopupVisible, setDeletePopupVisible] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [apiFinished, setApiFinished] = React.useState(false);

  React.useEffect(() => {
    if (apiFinished && projects.length === 0) {
      navigation.navigate('NoProjects');
    }
  }, [apiFinished, projects]);

  React.useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  React.useEffect(() => {}, [projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getProjects(userId, token);

      if (res?.data?.status === 'success') {
        setProjects(res?.data?.data || []);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setApiFinished(true);
    }
  };

  const renderItem = ({ item }: any) => {
    const imageUrl =
      item?.image?.length > 0
        ? { uri: `${IMG_URL}/${item.image[0]}` }
        : require('../../../assets/pngs/DummyImg.png');

    const statusText = item.status ? 'Active' : 'Closed';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('CommonProjectDetails', { project: item })
        }
      >
        <View style={styles.card}>
          <Image
            source={imageUrl}
            style={[styles.projectImage, !item.status && styles.closedImage]}
          />

          {isCustomer && (
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => {
                setSelectedProject(item);
                setDeletePopupVisible(true);
              }}
            >
              <OptionsIcon width={20} height={20} />
            </TouchableOpacity>
          )}

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.projectName}>{item.projectName}</Text>

              <Text style={styles.projectCode}>#{item._id}</Text>
            </View>

            {isCustomer && (
              <Text
                style={[
                  styles.status,
                  item.status ? styles.activeStatus : styles.closedStatus,
                ]}
              >
                {statusText}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Projects" showBack />
      <FlatList
        data={projects}
        keyExtractor={item => item._id}
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
        message="Are you sure you want to delete the project?"
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
    fontFamily: FONT.POPPINS_SEMIBOLD,
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
    color: '#0E77EF',
    fontFamily: FONT.POPPINS_MEDIUM,
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
    backgroundColor: '#3AA171',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  closedImage: {
    opacity: 0.5,
    // tintColor: 'gray',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
