import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';

// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { FONT } from '../../theme/fonts';
import { WIDTH, HEIGHT } from '../../utils/responsive';
import Building from '../../assets/svgs/Buildings.svg';

import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';

import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenWrapper from '../../utils/screenWrapper';

/* ---------------- TYPES ---------------- */

type Plan = {
  _id: string;
  title: string;
  price: string;
  period: 'Monthly' | 'Yearly';
  description: string;
};

// (optional) navigation type (you can adjust later)
type RootStackParamList = {
  Subscription: undefined;
};

const SubscriptionScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const user = useSelector(state => state.auth.user);
  const userId = user?._id;
  const token = useSelector((state: any) => state.auth.userToken);
  console.log(user, 'user in sinnnn');

  const [selectedTab, setSelectedTab] = useState<'monthly' | 'yearly'>(
    'monthly',
  );

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getProfile(userId, token);

      if (res?.data?.status === 'success') {
        setProfile(res.data.data);

        console.log('Profile data 12232424:', res.data.data);

        if (res.data.data.user?.isSubscribed) {
          navigation.replace('ProfTabNav');
        }
      }
    } catch (error) {
      console.log('Profile Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getSubscriptions();
      console.log(res, 'sunsfrrerereen');

      if (res?.data?.status === 'success') {
        setPlans(res.data.data);
      }
    } catch (e) {
      console.log('Error fething plans', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlan = plans.filter(plan =>
    selectedTab === 'monthly'
      ? plan.period === 'Monthly'
      : plan.period === 'Yearly',
  );

  const handleCreateOrder = async (plan: Plan) => {
    try {
      setLoading(true);

      const body = {
        userId: userId,
        packageId: plan._id,
        amount: plan.price,
        email: user?.email || 'test@gmail.com',
        name: `${user.firstName} ${user.lastName}` || 'User',
        contact: user?.phone || '9999999999',
      };

      console.log('CREATE ORDER BODY:', body);

      const res = await ApiManager.createOrder(body, token);

      if (res?.data?.status === 'success') {
        const paymentUrl = res.data.payment_url;

        Alert.alert(
          'Proceed to Payment',
          'You will be redirected to payment page.',
          [
            {
              text: 'Continue',
              onPress: () => Linking.openURL(paymentUrl),
            },
          ],
        );
      }
    } catch (error) {
      console.log(' FULL ERROR:', error?.response?.data);
      console.log(' STATUS:', error?.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (plan: Plan) => {
    return (
      <View key={plan._id} style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.price}>₹{plan.price}</Text>
          <Text style={styles.planTitle}>{plan.title}</Text>
        </View>

        <Text style={styles.subText}>{plan.description}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleCreateOrder(plan)}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ScreenWrapper style={styles.container}>
      {/* HEADER */}

      <ScreenHeader title={'Subsciption'} showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* TOP BANNER */}

        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>
              Everything you need to win more projects
            </Text>

            <Text style={styles.bannerSubtitle}>
              Unlock full access and grow your business with premium.
            </Text>
          </View>

          {/* <MaterialCommunityIcons
            name="office-building"
            size={70}
            color="#C6C6C6"
          /> */}

          <Building />
        </View>

        {/* FEATURES */}

        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              {/* <Ionicons name="document-text" size={18} color="#3AA171" /> */}
            </View>

            <Text style={styles.featureText}>Full access to live projects</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              {/* <Ionicons name="eye" size={18} color="#3AA171" /> */}
            </View>

            <Text style={styles.featureText}>
              View Complete enquiry details
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              {/* <Ionicons name="call" size={18} color="#3AA171" /> */}
            </View>

            <Text style={styles.featureText}>
              Contact project owner directly
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              {/* <Ionicons name="paper-plane" size={18} color="#3AA171" /> */}
            </View>

            <Text style={styles.featureText}>Submit Quotations</Text>
          </View>
        </View>

        {/* PLANS */}

        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading...</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredPlan.map((plan, index) => {
              const yearly = plan.period?.toLowerCase() === 'yearly';

              return (
                <View key={plan._id} style={styles.planCard}>
                  {yearly && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>MOST POPULAR</Text>
                    </View>
                  )}

                  <Text style={styles.planTitleCenter}>{plan.title}</Text>

                  <Text style={styles.planSub}>
                    Best value for serious professionals
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.bigPrice}>₹{plan.price}</Text>

                    <Text style={styles.yearText}>/{plan.period}</Text>
                  </View>

                  {yearly && (
                    <View style={styles.saveRow}>
                      <Text style={styles.oldPrice}>₹17,988</Text>

                      <View style={styles.saveBadge}>
                        <Text style={styles.saveText}>Save 17%</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.divider} />

                  {[
                    'Unlimited Projects Access',
                    'Contact Project Owners',
                    'Submit Quotations',
                    'Priority Visibility',
                  ].map(item => (
                    <View style={styles.featureRow} key={item}>
                      {/* <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#16A34A"
                      /> */}

                      <Text style={styles.cardFeature}>{item}</Text>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleCreateOrder(plan)}
                  >
                    <Text style={styles.buttonText}>Choose {plan.title}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  header: {
    fontSize: 22,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    color: '#111',
  },

  banner: {
    backgroundColor: '#EEF4EF',

    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  bannerTitle: {
    fontSize: 18,
    color: '#111',
    fontFamily: FONT.POPPINS_BOLD,
    lineHeight: 28,
  },

  bannerSubtitle: {
    marginTop: 6,
    color: '#666',
    fontSize: 12,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  featureContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    marginHorizontal: 20,
  },

  featureItem: {
    width: '23%',
    alignItems: 'center',
  },

  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  featureText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#444',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  planCard: {
    width: WIDTH(72),
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#4CAF7D',
    padding: 16,
    marginRight: 15,
    marginTop: 18,
  },

  popularBadge: {
    position: 'absolute',
    top: -15,
    alignSelf: 'center',
    backgroundColor: '#3AA171',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    zIndex: 10,
  },

  popularText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  planTitleCenter: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 22,
    color: '#111',
    fontFamily: FONT.POPPINS_BOLD,
  },

  planSub: {
    textAlign: 'center',
    color: '#777',
    marginTop: 5,
    marginBottom: 15,
    fontFamily: FONT.POPPINS_REGULAR,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  bigPrice: {
    fontSize: 38,
    color: '#111',
    fontFamily: FONT.POPPINS_BOLD,
  },

  yearText: {
    marginBottom: 8,
    fontSize: 16,
    color: '#666',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  saveRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 8,
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  saveBadge: {
    backgroundColor: '#DDF7E7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },

  saveText: {
    color: '#3AA171',
    fontSize: 11,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 18,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardFeature: {
    marginLeft: 10,
    color: '#333',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  button: {
    backgroundColor: '#3AA171',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
  },

  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 15,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
