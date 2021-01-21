import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

let config = {
  appId: '1:760692111499:android:cbe6dde0892631f7debc8e',
  apiKey: 'AIzaSyAeHo_npJGSLNSOtLfibdZpYKtkB5NqXTI',
  authDomain:
    '760692111499-88l985a4au0v94t3lg6sd8vbstor5d0f.apps.googleusercontent.com',
  databaseURL:
    'https://realtimeparkingbookingsystem-default-rtdb.firebaseio.com/',
  projectId: 'realtimeparkingbookingsystem',
  storageBucket: 'realtimeparkingbookingsystem.appspot.com',
  messagingSenderId: '',
  project_number: '760692111499',
};
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(config);
}

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      name: '',
    };
  }

  componentDidMount() {
    const user = auth().currentUser;
    // console.log('user', user);
    firebase
      .database()
      .ref('User')
      .on('value', (snapshot) => {
        // console.log('snapshot.val()', snapshot.val());
        const getValue = snapshot.val();
        // console.log('getValue', getValue);
        let array = [];
        for (let key in getValue) {
          // console.log("key", key)
          const value = {...getValue[key], key};
          array.push(value);
        }
        // console.log(array, 'array');
        const currentUser = array.filter(
          (el) => el.email.toLowerCase() === user.email.toLowerCase(),
        );
        // console.log('currentUser[0]', currentUser);
        this.setState({
          name: currentUser[0].name,
        });
      });
  }

  // viewBookedUsersList() {
  //   this.setState = {
  //     isLoading: false,
  //   };
  //   this.props.navigation.navigate('viewBookedUsersList');
  // }

  viewUsersList() {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('viewUsersList');
  }

  profile() {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('Profile');
  }

  location() {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('Location');
  }

  locationView() {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('LocationView');
  }

  signOut() {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        this.props.navigation.navigate('Home');
        AsyncStorage.removeItem('@User');
      });
  }

  render() {
    const {name} = this.state;
    return (
      <View style={styles.image}>
        {this.state.isLoading ? (
          <View>
            <View style={styles.container}>
              <Text style={styles.textHeader}> {name} </Text>
            </View>

            <View style={styles.container1}>
              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.profile()}>
                  <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.viewUsersList()}>
                  <Text style={styles.buttonText}>View Users List</Text>
                </TouchableOpacity>
              </View>

              {/* <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.viewBookedUsersList()}>
                  <Text style={styles.buttonText}>View Booked Users List</Text>
                </TouchableOpacity>
              </View> */}

              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.location()}>
                  <Text style={styles.buttonText}>Create Location Areas</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.locationView()}>
                  <Text style={styles.buttonText}>View Location Areas </Text>
                </TouchableOpacity>
              </View>

              <View style={{marginTop: 'auto'}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.signOut()}>
                  <Text style={styles.buttonText}>Sign out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <Text>Welcome</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    backgroundColor: '#f98b34',
  },
  //container View
  container: {
    alignItems: 'center',
    height: 100,
  },
  textHeader: {
    marginVertical: 50,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
  },
  //container1 View
  container1: {
    height: 490,
    marginVertical: 60,
    width: wp('95%'),
  },
  text: {
    marginVertical: 7,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#f39c12',
    borderRadius: 10,
    borderWidth: 2,
    width: wp('95%'),
    height: 60,
    marginHorizontal: 10,
    borderColor: '#67bae3',
  },
  buttonText: {
    marginVertical: 11,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
    alignSelf: 'center',
  },
});
