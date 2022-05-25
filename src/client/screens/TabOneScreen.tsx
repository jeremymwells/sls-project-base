import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import axios from 'axios';
// import Constants from 'expo-constants';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function TabOneScreen (props: any) /* RootTabScreenProps<'TabOne'>) */ {
  const [message, setMessage] = useState(props.message || '');
  const [organization, setOrganization] = useState(props.organization || '');
  // const [header, setHeader] = useState(props.header || '');

  useEffect(() => {
    if (!message) {
      console.log(axios.defaults.baseURL);
      axios.get('/app?message=Welcome to a full stack app ...')
        .then((response: any) => {
          setMessage(response.data);
        })
        .catch(error => {
          setMessage(`The server errored ${JSON.stringify(error)}`);
          console.error(error);
        });
    }
    if (!organization) {
      axios.get('/organization?orgId=1652913832318')
        .then((response: any) => {
          setOrganization(response.data);
          // setHeader(response.data.name);
        })
        .catch(error => {
          setOrganization(`The server errored ${JSON.stringify(error)}`);
          console.error(error);
        });
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>One Tab</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
});
