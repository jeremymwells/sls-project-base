import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStackNavigation from "./AuthStackNavigation";
import MainStackNavigation from "./MainStackNavigation";

const RootStack = createNativeStackNavigator<any>(); // redefine `any` for type safety

export default function RootStackNavigation({ user }: { user: any }) {
  return (
    <RootStack.Navigator>
      {
        (user) ?
          <RootStack.Screen
            name="Main"
            component={ MainStackNavigation }
            options={{ headerShown: false }}
          /> :
          <RootStack.Screen
            name="Auth"
            component={ AuthStackNavigation }
            options={{ headerShown: false }}
          />
      }
    </RootStack.Navigator>
  )
}