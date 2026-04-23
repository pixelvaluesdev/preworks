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
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import PlusIcon from '../../../assets/svgs/PlusIcon.svg';
import DeleteIcon from '../../../assets/svgs/Delete.svg';
import ScreenHeader from '../../../components/ScreenHeader';
import CustomPopup from '../../../components/Popups/CustomPopup';
import { useSelector } from 'react-redux';
import ApiManager from '../../../apis/ApiManager';
import { BASE_URL, IMG_URL } from '../../../apis/ApiManager';
import OptionsIcon from '../../../assets/svgs/ThreeDotsIcon.svg';
import SecondaryButton from '../../../components/Buttons/SecondaryBtn';
import DeleteICon from '../../../assets/svgs/BlackDeleteIcon.svg';
import EditIcon from '../../../assets/svgs/BlackEditIcon.svg';

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
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });
  const [apiFinished, setApiFinished] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState('quoted');
  const [quotedProjects, setQuotedProjects] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [interestedProjects, setInterestedProjects] = React.useState([
    { id: '1', name: 'House Construction' },
    { id: '2', name: 'House Construction' },
    { id: '3', name: 'House Construction' },
    { id: '4', name: 'House Construction' },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        if (isCustomer) {
          fetchProjects();
        } else {
          fetchProfessionalProjects();
        }
      }
    }, [userId]),
  );

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

  const fetchProfessionalProjects = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.appliedProjects(userId, token);

      if (res?.data?.status === 'success') {
        const data = res.data.data || [];

        // Split into two lists
        const quoted = data.filter(item => item.type === 'quotation');
        const interested = data.filter(item => item.type === 'enquiry');

        setQuotedProjects(quoted);
        setInterestedProjects(interested);
      }
    } catch (error) {
      console.log('Professional Projects Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject?._id) return;

    try {
      setLoading(true);

      const res = await ApiManager.deleteProject(selectedProject._id, token);

      if (res?.data?.status === 'success') {
        // Option 1 (best UX): remove from list instantly
        setProjects(prev =>
          prev.filter(item => item._id !== selectedProject._id),
        );

        await fetchProjects();
      }
    } catch (error) {
      console.log('Delete Error:', error);
    } finally {
      setLoading(false);
      setSelectedProject(null);
    }
  };

  const renderItem = ({ item }: any) => {
    const project = isCustomer ? item : item.projectId;

    const imageUrl =
      !isCustomer && item?.files?.length > 0
        ? { uri: `${IMG_URL}/${item.files[0]}` }
        : project?.image?.length > 0
        ? { uri: `${IMG_URL}/${project.image[0]}` }
        : require('../../../assets/pngs/DummyImg.png');

    const statusText = project?.status ? 'Active' : 'Closed';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (!isCustomer && item.type === 'enquiry') {
            //  Interested project → go to General Enquiry
            navigation.navigate('GeneralEnquiry', {
              projectId: item.projectId?._id,
            });
          } else {
            // Default (customer + quoted projects)
            navigation.navigate('CommonProjectDetails', {
              projectId: isCustomer ? item._id : item.projectId?._id,
            });
          }
        }}
      >
        <View style={styles.card}>
          <Image source={imageUrl} style={styles.projectImage} />

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.projectName}>
                {project?.projectName || 'No Name'}
              </Text>

              <Text style={styles.projectCode}>#{project?._id}</Text>
            </View>

            {/* Only customer shows status */}
            {isCustomer && (
              <Text
                style={[
                  styles.status,
                  project?.status ? styles.activeStatus : styles.closedStatus,
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

  // EMPTY STATE SECOND
  if (isCustomer && apiFinished && projects.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Projects" showBack />

        <View style={styles.content}>
          <Image
            source={require('../../../assets/pngs/NoProjectsImg.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.message}>
            {isCustomer
              ? "You don’t have any projects yet. Hit 'Add Project' to get started."
              : 'No projects uploaded yet from customers.'}
          </Text>

          {isCustomer && (
            <SecondaryButton
              title="Add Project Details"
              style={styles.button}
              onPress={() => navigation.navigate('AddProjectInformation')}
              icon={<PlusIcon height={20} width={30} />}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Projects" showBack />

      {!isCustomer && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'quoted' && styles.activeTab]}
            onPress={() => setSelectedTab('quoted')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'quoted' && styles.activeTabText,
              ]}
            >
              Quoted Projects
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'interested' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('interested')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'interested' && styles.activeTabText,
              ]}
            >
              Interested Projects
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {isCustomer && (
        <FlatList
          data={projects}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{
            paddingHorizontal: WIDTH(4),
            paddingBottom: HEIGHT(10),
          }}
        />
      )}

      {!isCustomer && (
        <>
          {selectedTab === 'quoted' ? (
            quotedProjects.length > 0 ? (
              <FlatList
                data={quotedProjects}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={{
                  paddingHorizontal: WIDTH(4),
                  paddingBottom: HEIGHT(10),
                }}
              />
            ) : (
              <View style={styles.content}>
                <Image
                  source={require('../../../assets/pngs/NoProjectsImg.png')}
                  style={styles.image}
                />
                <Text style={styles.message}>
                  You haven’t quoted any projects yet.
                </Text>
              </View>
            )
          ) : interestedProjects.length > 0 ? (
            <FlatList
              data={interestedProjects}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              refreshing={refreshing}
              onRefresh={onRefresh}
              contentContainerStyle={{
                paddingHorizontal: WIDTH(4),
                paddingBottom: HEIGHT(10),
              }}
            />
          ) : (
            <View style={styles.content}>
              <Image
                source={require('../../../assets/pngs/NoProjectsImg.png')}
                style={styles.image}
              />
              <Text style={styles.message}>
                You haven’t shown interest in any project.
              </Text>
            </View>
          )}
        </>
      )}

      {menuVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.menuContainer,
              { top: menuPosition.y, left: menuPosition.x - 120 },
            ]}
          >
            {/* Edit */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('AddProjectInformation', {
                  isEdit: true,
                  projectId: selectedProject._id,
                });
              }}
            >
              <EditIcon width={20} height={20} />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setDeletePopupVisible(true);
              }}
            >
              <DeleteICon width={20} height={20} />
              <Text style={[styles.menuText, { color: 'red' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

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
              handleDeleteProject();
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
    backgroundColor: 'rgba(119, 119, 119, 0.51)',
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: WIDTH(6),
  },

  image: {
    width: WIDTH(70),
    height: HEIGHT(35),
  },

  message: {
    fontSize: 16,
    fontFamily: FONT.POPPINS_MEDIUM,
    marginTop: HEIGHT(2),
    textAlign: 'center',
  },

  button: {
    marginTop: HEIGHT(3),
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: -30,
    left: 20,
    right: 0,
    bottom: 0,
  },

  menuContainer: {
    position: 'absolute',
    width: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 2,
    elevation: 5,
  },

  menuItem: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 6,
  },

  menuText: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_MEDIUM,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: WIDTH(4),
    marginTop: HEIGHT(2),
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: HEIGHT(2),
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#3AA171',
    borderRadius: 10,
  },

  tabText: {
    fontFamily: FONT.POPPINS_MEDIUM,
    color: '#555',
  },

  activeTabText: {
    color: '#fff',
  },
});
