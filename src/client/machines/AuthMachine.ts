import { assign, createMachine, Machine } from 'xstate';
import * as SecureStore from 'expo-secure-store';
const { encode } = require('base-64');

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { finish, start } from './utils';

export enum states {
  InitializeAuth = 'Initialize-Auth-Flow',
  FinalizeAuth = 'Finalize-Auth-Flow',
  TryResumeSession = 'Try-Resume-Session',
  CheckStorageForToken = 'Check-if-Token-in-Storage',
  CheckToken = 'Check-Token',
  TokenValidAndUnexpired = 'Token-Valid-and-Unexpired',
  BootUserSession = 'Boot-User-Session',
  BootUserSessionOrLogin = 'Boot-User-Sessionor-Login',
  SignIn = 'Sign-User-In',
  SignOut = 'Sign-User-Out',
  ResetPassword = 'Reset-Password',
}

export interface iAuthMachineContext {
  platform: string
  token: {
    raw: string,
    decoded: {
      isValid: () => boolean,
      isNotExpired: () => boolean,
      claims: any | {}
    }
  },
  isAuthenticated: boolean,
  user: any,
  errors: any[],
}

const StorageKeys = {
  UserToken: encode('userToken') as string
}


const initialContext: iAuthMachineContext = {
  platform: '',
  token: {
    raw: '',
    decoded: { 
      isValid: (): boolean => true,
      isNotExpired: (): boolean => true,
      claims: { } as any
    }
  },
  isAuthenticated: false,
  user: undefined,
  errors: [],
}

export const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  context: initialContext,
  states: {
    idle: {
      on: {
        [states.InitializeAuth]: {
          target: states.TryResumeSession
        }
      }
    },
    [states.TryResumeSession]: {
      initial: states.CheckStorageForToken,
      on: {
        [states.CheckStorageForToken]: {
          target: states.FinalizeAuth,
          actions: async (context: iAuthMachineContext) => {
            console.log('HAYO, in', states.CheckStorageForToken);
            if (Platform.OS !== 'web') { //non web storage
              try {
                context.token.raw = (await SecureStore.getItemAsync(StorageKeys.UserToken)) || '';
              } catch (error) {
                context.errors.push(error);
                console.error(error);
              }
              
            } else { // web storage
              try {
                context.token.raw = (await AsyncStorage.getItem(StorageKeys.UserToken)) || '';
              } catch (error) {
                context.errors.push(error);
                console.error(error)
              }
            }

            return assign({ ...context })
          }
        },
      }
    },
    [states.FinalizeAuth]: {
      type: 'final'
    }
  }
});

export const selectors = {
  user: (state: iAuthMachineContext) => {
    return state.user;
  },
  isLoggedIn: (state: iAuthMachineContext) => {
    if (
      state.token.decoded.isNotExpired() && 
      state.token.decoded.isValid()
    ) {
      return true;
    }
    return false;
  }
}