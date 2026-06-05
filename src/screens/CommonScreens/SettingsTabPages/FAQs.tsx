import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import ApiManager from '../../../apis/ApiManager';
import ScreenWrapper from '../../../utils/screenWrapper';
import ScreenHeader from '../../../components/ScreenHeader';

import Colors from '../../../constants/colors';
import { FONT } from '../../../theme/fonts';
import { HEIGHT, WIDTH } from '../../../utils/responsive';

import { triggerHaptic } from '../../../utils/hapticks';

const FAQScreen = () => {
  const navigation = useNavigation();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);

      const response = await ApiManager.getFAQ();

      if (response?.data?.status === 'success') {
        setFaqs(response?.data?.data || []);
      }
    } catch (error) {
      console.log('FAQ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = id => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item._id;

    return (
      <View style={styles.faqItem}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.questionRow}
          onPress={() => toggleFaq(item._id)}
        >
          <Text style={styles.questionText}>{item.question}</Text>

          <Text style={styles.icon}>{isExpanded ? '−' : '+'}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.answerContainer}>
            {item.answers?.map((answer, index) => (
              <Text key={index} style={styles.answerText}>
                {answer}
              </Text>
            ))}
          </View>
        )}
      </View>
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
    <ScreenWrapper style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScreenHeader
          title="FAQ"
          showBack
          onBackPress={() => {
            navigation.goBack();
            triggerHaptic('impactHeavy');
          }}
        />

        <View style={{ marginBottom: 10 }} />

        <FlatList
          data={faqs}
          keyExtractor={(item, index) =>
            item?._id?.toString() || index.toString()
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={() => <View style={styles.topDivider} />}
          contentContainerStyle={{
            paddingBottom: HEIGHT(4),
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  topDivider: {
    height: 1,
    backgroundColor: '#D9D9D9',
  },

  separator: {
    height: 1,
    backgroundColor: '#D9D9D9',
  },

  faqItem: {
    paddingHorizontal: WIDTH(5),
    paddingVertical: HEIGHT(2),
    backgroundColor: '#FFFFFF',
  },

  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  questionText: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    fontFamily: FONT.POPPINS_MEDIUM,
    paddingRight: 15,
  },

  icon: {
    fontSize: 26,
    color: '#3AA171',
    fontFamily: FONT.POPPINS_MEDIUM,
    width: 24,
    textAlign: 'center',
  },

  answerContainer: {
    marginTop: HEIGHT(1.5),
    paddingRight: WIDTH(8),
  },

  answerText: {
    color: '#8A8A8A',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FONT.POPPINS_REGULAR,
    marginBottom: 5,
  },
});
