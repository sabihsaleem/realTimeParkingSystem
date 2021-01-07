import {firebase} from '@react-native-firebase/database';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Routes from './Nav';

let config = {
  appId: '1:760692111499:android:cbe6dde0892631f7debc8e',
  apiKey: 'AIzaSyAeHo_npJGSLNSOtLfibdZpYKtkB5NqXTI',
  authDomain: '760692111499-88l985a4au0v94t3lg6sd8vbstor5d0f.apps.googleusercontent.com',
  databaseURL: 'https://realtimeparkingbookingsystem-default-rtdb.firebaseio.com/',
  projectId: 'realtimeparkingbookingsystem',
  storageBucket: 'realtimeparkingbookingsystem.appspot.com',
  messagingSenderId: '',
  project_number: "760692111499",
};
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(config);
}

class App extends React.Component {
  constructor(){
    super()
  }
  


  render() {
    return (
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    );
  }
}


export default App;