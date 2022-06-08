import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";


const AuthStack = createNativeStackNavigator<any>(); // redefine `any` for type safety


export default function AuthStackNavigation() {
  
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={ SignInScreen } />
      <AuthStack.Screen name="Sign Up" component={ SignUpScreen } />
      <AuthStack.Screen name="Forgot Password" component={ ForgotPasswordScreen } />
    </AuthStack.Navigator>
  );
}