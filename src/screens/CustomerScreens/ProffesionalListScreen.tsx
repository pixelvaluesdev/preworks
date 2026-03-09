import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ProfessionalListScreen = () => {
  const route = useRoute();
  const { type } = route.params as { type: string };

  return (
    <View>
      <Text>{type} Professionals</Text>
    </View>
  );
};

export default ProfessionalListScreen;
