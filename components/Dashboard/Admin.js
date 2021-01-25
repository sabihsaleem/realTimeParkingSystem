import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    firebase
      .database()
      .ref('User')
      .on('value', (snapshot) => {
        const getValue = snapshot.val();
        let array = [];
        for ( let key in getValue ) {
          const value = {...getValue[key], key};
          array.push(value);
        }
        const currentUser = array.filter(
          (el) => el.email.toLowerCase() === user.email.toLowerCase(),
        );
        this.setState ({
          name: currentUser[0].name,
        });
      });
  }

  viewUsersList () {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('viewUsersList');
  }

  profile () {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('AdminProfile');
  }

  location () {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('Location');
  }

  locationView () {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('LocationView');
  }

  signOut () {
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
                  onPress={ () => this.profile()}>
                  <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={ () => this.viewUsersList()}>
                  <Text style={styles.buttonText}>View Users List</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={ () => this.location()}>
                  <Text style={styles.buttonText}>Create Location Areas</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={ () => this.locationView()}>
                  <Text style={styles.buttonText}>View Location Areas </Text>
                </TouchableOpacity>
              </View>

              <View style={{marginTop: 'auto'}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={ () => this.signOut()}>
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
