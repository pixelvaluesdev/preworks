import React, { useCallback, useEffect, useState } from 'react'; //sdk
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';

import { useSelector } from 'react-redux';

import RazorpayCheckout from 'react-native-razorpay';

import { FONT } from '../../theme/fonts';
import { WIDTH, HEIGHT } from '../../utils/responsive';
import ApiManager from '../../apis/ApiManager';

/* ---------------- TYPES ---------------- */

type Plan = {
  _id: string;
  title: string;
  price: string;
  period: 'Monthly' | 'Yearly';
  description: string;
};

type RootStackParamList = {
  Subscription: undefined;
  ProfTabNav: undefined;
};

const SubscriptionScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.userToken);

  const userId = user?._id;

  const [selectedTab, setSelectedTab] = useState<'monthly' | 'yearly'>(
    'monthly',
  );

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- PROFILE ---------------- */

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getProfile(userId, token);

      console.log('PROFILE RESPONSE =>', res?.data);

      if (res?.data?.status === 'success') {
        const profileData = res?.data?.data;

        if (profileData?.user?.isSubscribed) {
          navigation.replace('ProfTabNav');
        }
      }
    } catch (error) {
      console.log('PROFILE ERROR =>', error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PLANS ---------------- */

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const res = await ApiManager.getSubscriptions();

      console.log('SUBSCRIPTION RESPONSE =>', res?.data);

      if (res?.data?.status === 'success') {
        setPlans(res?.data?.data || []);
      }
    } catch (error) {
      console.log('FETCH PLAN ERROR =>', error);

      // DUMMY DATA IF API FAILS
      setPlans([
        {
          _id: '1',
          title: 'Starter Plan',
          price: '499',
          period: 'Monthly',
          description: 'Access for one month',
        },
        {
          _id: '2',
          title: 'Premium Plan',
          price: '999',
          period: 'Monthly',
          description: 'Premium monthly subscription',
        },
        {
          _id: '3',
          title: 'Yearly Plan',
          price: '4999',
          period: 'Yearly',
          description: 'Save more with yearly plan',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER PLAN ---------------- */

  const filteredPlan = plans.filter(plan =>
    selectedTab === 'monthly'
      ? plan.period === 'Monthly'
      : plan.period === 'Yearly',
  );

  /* ---------------- PAYMENT ---------------- */

  const handleCreateOrder = async (plan: Plan) => {
    try {
      setLoading(true);

      // OPTIONAL BODY
      const body = {
        userId: userId || 'dummy_user_id',
        packageId: plan._id,
        amount: plan.price,
        email: user?.email || 'test@gmail.com',
        name: `${user?.firstName || 'Test'} ${user?.lastName || 'User'}`,
        contact: user?.phone || '9999999999',
      };

      console.log('CREATE ORDER BODY =>', body);

      /*
        REAL API CALL
        Uncomment later when backend is ready
      */

      // const res = await ApiManager.createOrder(body, token);

      /*
        DUMMY RESPONSE
      */

      const dummyResponse = {
        data: {
          status: 'success',
          data: {
            currency: 'INR',
            amount: Number(plan.price) * 100,
            orderId: 'order_Qwerty123456789',
          },
        },
      };

      console.log('DUMMY ORDER RESPONSE =>', dummyResponse);

      if (dummyResponse?.data?.status === 'success') {
        const options = {
          description: plan.description || 'Subscription Payment',

          image: 'https://i.imgur.com/3g7nmJC.jpg',

          currency: dummyResponse.data.data.currency,

          key: 'rzp_test_SukuuBUdHEG643',

          amount: dummyResponse.data.data.amount,

          name: 'PreWorks',

          order_id: dummyResponse.data.data.orderId,

          prefill: {
            email: user?.email || 'test@gmail.com',

            contact: user?.phone || '9999999999',

            name: `${user?.firstName || 'Test'} ${user?.lastName || 'User'}`,
          },

          theme: {
            color: '#3AA171',
          },
        };

        console.log('RAZORPAY OPTIONS =>', options);

        RazorpayCheckout.open(options)
          .then((data: any) => {
            console.log('PAYMENT SUCCESS =>', data);

            Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}`);
          })
          .catch((error: any) => {
            console.log('PAYMENT FAILED =>', error);

            Alert.alert(
              'Payment Failed',
              error?.description || 'Something went wrong',
            );
          });
      }
    } catch (error: any) {
      console.log('PAYMENT ERROR =>', error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CARD ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Subscription</Text>

      {/* TOGGLE */}

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            selectedTab === 'monthly' && styles.activeToggle,
          ]}
          onPress={() => setSelectedTab('monthly')}
        >
          <Text
            style={[
              styles.toggleText,
              selectedTab === 'monthly' && styles.activeText,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            selectedTab === 'yearly' && styles.activeToggle,
          ]}
          onPress={() => setSelectedTab('yearly')}
        >
          <Text
            style={[
              styles.toggleText,
              selectedTab === 'yearly' && styles.activeText,
            ]}
          >
            Yearly
          </Text>
        </TouchableOpacity>
      </View>

      {/* LOADER */}

      {loading ? (
        <ActivityIndicator size="large" color="#3AA171" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredPlan.map(renderCard)}
        </ScrollView>
      )}
    </View>
  );
};

export default SubscriptionScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: WIDTH(5),
    paddingTop: HEIGHT(5),
  },

  header: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: HEIGHT(3),
    color: '#000',
  },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDEDED',
    borderRadius: 30,
    padding: 4,
    marginBottom: HEIGHT(3),
    alignSelf: 'center',
  },

  toggleBtn: {
    paddingVertical: HEIGHT(1),
    paddingHorizontal: WIDTH(6),
    borderRadius: 30,
  },

  activeToggle: {
    backgroundColor: '#FFFFFF',
  },

  toggleText: {
    fontFamily: FONT.POPPINS_MEDIUM,
    color: '#777',
  },

  activeText: {
    color: '#3AA171',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: WIDTH(5),
    marginBottom: HEIGHT(2),
    borderColor: '#F2F3F5',
    borderWidth: 2,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 24,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    color: '#000',
  },

  planTitle: {
    fontSize: 15,
    fontFamily: FONT.POPPINS_SEMIBOLD,
    color: '#3AA171',
  },

  subText: {
    marginTop: HEIGHT(1),
    color: '#747284',
    fontFamily: FONT.POPPINS_MEDIUM,
    lineHeight: 22,
  },

  button: {
    backgroundColor: '#3AA171',
    marginTop: HEIGHT(2),
    paddingVertical: HEIGHT(1.5),
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    fontSize: 14,
  },
});
