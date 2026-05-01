import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FONT } from '../../theme/fonts';
import { WIDTH, HEIGHT } from '../../utils/responsive';
import Colors from '../../constants/colors';
import { useNavigation, NavigationProp } from '@react-navigation/native';

/* ---------------- TYPES ---------------- */

type Plan = {
  id: number;
  title: string;
  price: string;
  features: string[];
};

// (optional) navigation type (you can adjust later)
type RootStackParamList = {
  Subscription: undefined;
};

const SubscriptionScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState<'monthly' | 'yearly'>(
    'monthly',
  );

  const plans: Plan[] = [
    {
      id: 1,
      title: 'Basic',
      price: '$9/month',
      features: [
        'Lorem ipsum',
        'Lorem ipsum sit dolor',
        'Lorem ipsum dolor amet',
        'Lorem ipsum dolor amet',
      ],
    },
    {
      id: 2,
      title: 'Advance',
      price: '$16/month',
      features: [
        'Lorem ipsum',
        'Lorem ipsum sit dolor',
        'Lorem ipsum dolor amet',
        'Lorem ipsum dolor amet',
      ],
    },
  ];

  const renderCard = (plan: Plan) => {
    return (
      <View key={plan.id} style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.planTitle}>{plan.title}</Text>
        </View>

        <Text style={styles.subText}>Unlock premium access</Text>

        <View style={{ marginTop: 10 }}>
          {plan.features.map((item: string, index: number) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.check}>✔</Text>
              <Text style={styles.featureText}>{item}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Selected Plan:', plan);
            // later: createOrder(plan.id)
          }}
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {plans.map(renderCard)}
      </ScrollView>
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
    fontFamily: FONT.POPPINS_MEDIUM,
    color: '#555',
  },

  subText: {
    marginTop: 5,
    color: '#888',
    fontFamily: FONT.POPPINS_REGULAR,
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
