import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';



export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Image style={styles.image} source={require("../assets/images/anon-logo.png")} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <View style={[ styles.inputView, styles.actionRow ]}>
        <TouchableOpacity style={[ styles.actionRowCell ]}>
          <Text style={styles.actionItem}>Forgot Password?</Text>
        </TouchableOpacity>


        <TouchableOpacity style={[ styles.actionRowCell ]}>
          <Text style={styles.actionItem}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={[ styles.inputView, styles.actionRow ]}>
        <TouchableOpacity style={[ styles.loginButton ]}>
          <Text style={{...styles.actionItem, color: 'white', fontWeight: '700', fontSize: 25 }}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexFlow: 'row',
  },
  actionRowCell: {
    width: '40%',
    marginTop: '-20px',
    alignItems: 'center',
    borderRadius: 30,
    padding: 10,
  },
  actionItem: {
    alignItems: 'center',
  },
  image: {
    marginBottom: 40,
    width: '200px',
    height: '150px',
    resizeMode: 'stretch',
  },
  headerText: {
    fontSize: 40,
    textTransform: 'uppercase',
    marginBottom: '1em',
  },
  inputView: {
    backgroundColor: "#FFF",
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    width: '100%',
    borderRadius: 30,
    border: '1px solid silver',
    flex: 1,
    padding: 10,
  },
  loginButton: {
    width: '100%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'dodgerblue',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 10
  }
});


 