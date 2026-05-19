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
import { FONT } from '../../theme/fonts';
import { WIDTH, HEIGHT } from '../../utils/responsive';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';

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
      console.log('❌ FULL ERROR:', error?.response?.data);
      console.log('❌ STATUS:', error?.response?.status);
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
    <View style={styles.container}>
      {/* HEADER */}
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

      {/* CARDS */}
      {loading ? (
        <Text style={{ textAlign: 'center' }}>Loading...</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredPlan.map(renderCard)}
        </ScrollView>
      )}
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: WIDTH(5),
    paddingTop: HEIGHT(5),
  },

  header: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: FONT.POPPINS_SEMIBOLD,
    marginBottom: 20,
  },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDEDED',
    borderRadius: 30,
    padding: 4,
    marginBottom: 20,
    alignSelf: 'center',
  },

  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
  },

  activeToggle: {
    backgroundColor: '#fff',
  },

  toggleText: {
    fontFamily: FONT.POPPINS_MEDIUM,
    color: '#777',
  },

  activeText: {
    color: '#3AA171',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderColor: '#F2F3F5',
    borderWidth: 2,
    marginHorizontal: 14,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 22,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  planTitle: {
    fontSize: 14,
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },

  subText: {
    marginTop: 5,
    color: '#747284',
    fontFamily: FONT.POPPINS_MEDIUM,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  check: {
    color: '#3AA171',
    marginRight: 8,
  },

  featureText: {
    fontFamily: FONT.POPPINS_REGULAR,
    color: '#333',
  },

  button: {
    backgroundColor: '#3AA171',
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontFamily: FONT.POPPINS_SEMIBOLD,
  },
});
