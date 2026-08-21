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
import Sub1 from '../../assets/svgs/Sub1.svg';
import Sub2 from '../../assets/svgs/Sub2.svg';
import Sub3 from '../../assets/svgs/Sub3.svg';
import Sub4 from '../../assets/svgs/Sub4.svg';
import TrustedIcon from '../../assets/svgs/TrustedSvg.svg';

import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';

import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenWrapper from '../../utils/screenWrapper';
import RazorpayCheckout from 'react-native-razorpay';
import Colors from '../../constants/colors';
import MsgSvg from '../../assets/svgs/MsgSvg.svg';

import CallSvg from '../../assets/svgs/CallSvg.svg';

import FileSvg from '../../assets/svgs/FileSvg.svg';

import EyeSvg from '../../assets/svgs/EyeSvg.svg';

/* ---------------- TYPES ---------------- */

type Plan = {
  _id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  period: number;
  razorpayPlanId: string;
  isActive: boolean;
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
  const [extraDetails, setExtraDetails] = useState({
    title: '',
    description: '',
  });

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

        // console.log('Profile data 12232424:', res.data.data);

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
    fetchExtraDetails();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getPlans(token);
      console.log(res, 'sunsfrrerereen');

      if (res?.data?.status === 'success') {
        console.log(res.data.data, 'Plansssssssss ddataaa');
        setPlans(res.data.data);
      }
    } catch (e) {
      console.log('Error fething plans', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchExtraDetails = async () => {
    try {
      const res = await ApiManager.getExtraDetails(token);

      console.log('EXTRA DETAILS:', res?.data);

      if (res?.data?.status === 'success') {
        setExtraDetails({
          title: res.data.data?.title || '',
          description: res.data.data?.description || '',
        });
      }
    } catch (error) {
      console.log('Error fetching extra details:', error);
    }
  };

  const filteredPlan = plans;

  const handleCreateOrder = async (plan: Plan) => {
    try {
      setLoading(true);

      const body = {
        userId,
        planId: plan._id,
        // temp payment type for testing
        paymentType: 'subscription',
      };

      console.log('CREATE SUBSCRIPTION BODY:', body);
      console.log('TOKEN:', token);

      const response = await ApiManager.createSubscription(body, token);

      console.log('Create subscripyionn', response);

      if (!response?.data?.success) {
        Alert.alert('Error', response?.data?.message || 'Something went wrong');
        return;
      }

      const data = response.data.data;

      console.log('SUBSCRIPTION DATA:', data);

      const options = {
        key: data.razorpayKey,

        subscription_id: data.subscriptionId,

        name: 'PreWorks',

        description: data.planName,

        currency: data.currency,

        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`,

          email: user?.email,

          contact: user?.phone,
        },

        theme: {
          color: Colors.primary,
        },
      };

      console.log('RAZORPAY OPTIONS:', options);

      RazorpayCheckout.open(options)
        .then(async payment => {
          console.log('PAYMENT SUCCESS', payment);

          const verifyBody = {
            userId,
            razorpay_payment_id: payment.razorpay_payment_id,
            razorpay_subscription_id: payment.razorpay_subscription_id,

            razorpay_signature: payment.razorpay_signature,
          };

          console.log('VERIFY BODY', verifyBody);
          const verifyRes = await ApiManager.verifySubscription(
            verifyBody,
            token,
          );

          console.log('VERIFY RESPONSE', verifyRes.data);

          if (verifyRes.data.success) {
            Alert.alert('Success', 'Subscription activated successfully.');

            fetchProfile();
          } else {
            Alert.alert('Verification Failed', verifyRes.data.message);
          }
        })
        .catch(error => {
          console.log('PAYMENT FAILED:', error);

          console.log('VERIFY ERROR STATUS:', error?.response?.status);

          console.log('VERIFY ERROR DATA:', error?.response?.data);

          Alert.alert(
            'Payment Verification Failed',
            error?.response?.data?.message || 'Payment verification failed.',
          );
        });
    } catch (error: any) {
      console.log('STATUS:', error?.response?.status);
      console.log('ERROR:', error?.response);
      console.log('REQUEST:', error?.config?.data);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (plan: Plan) => {
    console.log('Plannnns desi', plan);
    return (
      <View key={plan._id} style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.priceRow}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <Text style={styles.amount}>{plan.amount}</Text>
            <Text style={styles.yearText}>
              /{plan.interval === 'monthly' ? 'Month' : 'Year'}
            </Text>
          </View>
          <Text style={styles.planTitle}>{plan.name}</Text>
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
              <Sub1 />
            </View>
            <Text style={styles.featureText}>Full access to live projects</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Sub2 />
            </View>

            <Text style={styles.featureText}>
              View Complete enquiry details
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Sub3 />
            </View>

            <Text style={styles.featureText}>
              Contact project owner directly
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Sub4 />
            </View>

            <Text style={styles.featureText}>Submit Quotations</Text>
          </View>
        </View>

        {/* PLANS */}

        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading...</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
          >
            {filteredPlan.map((plan, index) => {
              const yearly = plan.interval === 'yearly';

              return (
                <View key={plan._id} style={styles.planCard}>
                  {plan.popularity ? (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>{plan.popularity}</Text>
                    </View>
                  ) : null}

                  <Text style={styles.planTitleCenter}>{plan.name}</Text>

                  <Text style={styles.planSub}>
                    Best value for serious professionals
                  </Text>

                  <View style={styles.priceRow}>
                    <View style={styles.priceRow}>
                      <Text style={styles.rupeeSymbol}>₹</Text>
                      <Text style={styles.amount}>{plan.amount}</Text>
                      <Text style={styles.yearText}>
                        /{plan.interval === 'monthly' ? 'Month' : 'Year'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.oldPrice}>₹{plan.mainAmount}</Text>

                  {/* {yearly && (
                    <View style={styles.saveRow}>
                      <Text style={styles.oldPrice}>₹17,988</Text>

                      <View style={styles.saveBadge}>
                        <Text style={styles.saveText}>Save 17%</Text>
                      </View>
                    </View>
                  )} */}

                  <View style={styles.divider} />

                  <View style={styles.featureRow}>
                    {/* <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#16A34A"
                      /> */}

                    <Text style={styles.cardFeature}>{plan.description}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleCreateOrder(plan)}
                  >
                    <Text style={styles.buttonText}>Choose {plan.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}
        {/* TRUSTED FOOTER */}

        {/* TRUSTED FOOTER */}

        <View style={styles.trustedContainer}>
          <View style={styles.trustedIconContainer}>
            <TrustedIcon />
          </View>

          <View style={styles.trustedContent}>
            <Text style={styles.trustedTitle}>{extraDetails.title}</Text>

            <Text style={styles.trustedText}>{extraDetails.description}</Text>
          </View>
        </View>

        {/* SECURE PAYMENT FOOTER */}

        <View style={styles.secureFooter}>
          {/* <MaterialCommunityIcons name="lock" size={18} color="#A7A7A7" /> */}

          <Text style={styles.secureText}>
            Secure payments. Cancel anytime.
          </Text>
        </View>
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

    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 16,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 22,
    marginHorizontal: 20,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },

  featureIcon: {
    width: 10,
    height: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
  },

  featureText: {
    flex: 1,
    fontSize: 12,
    color: '#444',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  planCard: {
    width: WIDTH(72),
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#4CAF7D',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    marginRight: 15,
    marginTop: 18,
  },

  popularBadge: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    backgroundColor: '#3AA171',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    zIndex: 100,
  },

  popularText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  planTitleCenter: {
    textAlign: 'center',
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
    marginBottom: 2,
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
    color: '#9A9A9A',
    fontSize: 18,

    marginBottom: 14,
    textAlign: 'center',
    fontFamily: FONT.POPPINS_SEMIBOLD,
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
    backgroundColor: '#ECECEC',
    marginVertical: 18,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardFeature: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginLeft: 0,
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
  rupeeSymbol: {
    fontSize: 26,
    color: '#8A8A8A',
    fontFamily: FONT.POPPINS_MEDIUM,
    marginBottom: 8,
    marginRight: 6,
  },

  amount: {
    fontSize: 40,
    color: '#111',
    fontFamily: FONT.POPPINS_BOLD,
  },

  yearText: {
    fontSize: 16,
    color: '#666',
    fontFamily: FONT.POPPINS_MEDIUM,
    marginBottom: 8,
    marginLeft: 4,
  },
  trustedContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF',

    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 18,

    marginHorizontal: 18,
    marginTop: 28,
    paddingHorizontal: 12,
    paddingVertical: 18,
  },

  trustedIconContainer: {
    width: 54,
    height: 44,

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 16,
  },

  trustedContent: {
    flex: 1,
  },

  trustedTitle: {
    fontSize: 14,
    color: '#111827',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 5,
  },

  trustedText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#777',
    fontFamily: FONT.POPPINS_REGULAR,
  },

  secureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 22,
    marginBottom: 10,

    paddingHorizontal: 10,
  },

  secureText: {
    fontSize: 11,
    color: '#A0A0A0',
    fontFamily: FONT.POPPINS_REGULAR,
    marginLeft: 6,
  },

  secureDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CFCFCF',
    marginHorizontal: 12,
  },
});
