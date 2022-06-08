import React, { useState, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';
import Constants from 'expo-constants';

// @ts-ignore
import { withAuthenticator } from 'aws-amplify-react-native';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import { authMachine, states as authStates } from './machines/AuthMachine';
import { useMachine } from '@xstate/react';
import RootStackNavigation from './stacks/RootStackNavigation';

axios.defaults.baseURL = `${Constants.manifest?.extra?.apiRoot}/`;

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
// const RootStack = createNativeStackNavigator<any>(); // redefine `any` for type safety
// const MainStack = createNativeStackNavigator<any>(); // redefine `any` for type safety
// const AuthStack = createNativeStackNavigator<any>(); // redefine `any` for type safety

// function MainStackScreen() {
//   return (
//     <MainStack.Navigator>
//       <MainStack.Screen name="Home" component={HomeScreen} />
//     </MainStack.Navigator>
//   );
// }

// function AuthStackScreen() {
//   return (
//     <AuthStack.Navigator>
//       <AuthStack.Screen name="Login" component={SignInScreen} />
//     </AuthStack.Navigator>
//   );
// }


export default function App(props: any) {
  const [ authState, authSend ] = useMachine(authMachine);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  
  return (isLoadingComplete) ?
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <RootStackNavigation user={authState.context.user} />
      </NavigationContainer>
    </SafeAreaProvider> :
    null;
}

