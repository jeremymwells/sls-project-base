import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";


const MainStack = createNativeStackNavigator<any>(); // redefine `any` for type safety

export default function MainStackNavigation() {
  
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={HomeScreen} />
    </MainStack.Navigator>
  );
}