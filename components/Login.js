import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
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

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: true,
      userList:[]
    };
  }

  componentDidMount() {
    firebase
        .database()
        .ref('User')
        .on('value', (snapshot) => {
        console.log("snapshot.val()", snapshot.val())
        const getValue = snapshot.val();
        console.log("getValue", getValue)
        let userArray = [];
        for (let key in getValue) {
            // console.log("key", key)
            const value = {...getValue[key], key};
            userArray.push(value);
        }
        console.log(userArray,'accc');
        this.setState({
            userList: userArray,
        });
        });
  }

  onLogin(){
    if (this.state.email && this.state.password) {
        let x = this.state.userList.filter(
          (el) => el.email.toLowerCase() === this.state.email.toLowerCase(),
        );
        console.log('x', x);
        if (x[0]) {
          if (x[0].isAdmin === true) {
            console.log('x');
            firebase
              .auth()
              .signInWithEmailAndPassword(this.state.email, this.state.password)
              .then(async (err) => {
                console.log(err.user.email, 'Welcome!');
  
                let Data = this.state.userList.filter(
                  (el) => el.email === err.user.email,
                );
                console.log('data:', Data);
                try {
                  var currentUser = {...Data};
                  await AsyncStorage.setItem(
                    '@User',
                    JSON.stringify(currentUser),
                  );
                } catch (err) {
                  console.log('err', err);
                }
                this.props.navigation.navigate('Admin');
              })
              .catch((error) => {
                console.log('error', error);
                Alert.alert('Error!', 'Incorrect Data');
              });
          } else {
            console.log('xx');
            firebase
              .auth()
              .signInWithEmailAndPassword(this.state.email, this.state.password)
              .then(async (err) => {
                console.log(err.user.email, 'Welcome!');
                let Data = this.state.userList.filter(
                  (el) =>
                    el.email.toLowerCase() === err.user.email.toLocaleLowerCase(),
                );
                console.log('data:', Data);
                try {
                  var currentUser = {...Data};
                  await AsyncStorage.setItem(
                    '@User',
                    JSON.stringify(currentUser),
                  );
                } catch (err) {
                  console.log('err', err);
                }
                this.props.navigation.navigate('User');
              })
              .catch((error) => {
                console.log('error', error);
                Alert.alert('Error!', 'Incorrect Email');
              });
          }
        } else {
          Alert.alert('Error!', 'Incorrect Data Enter');
        }
      } else {
        alert('Enter Data Please');
      }
  
      console.log('LOGIN');
  }

  onRegister(){
    this.props.navigation.navigate('Registeration')
  }

  render() {
      const { userList, email, password } = this.state
      // console.log(userList,'userList')
    return (
        <View style={styles.main}>
        {this.state.isLoading ?
        <KeyboardAwareScrollView>

            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                    // this.props.navigation.goBack();
                    this.props.navigation.navigate('Home');
                    }}
                >
                    <Image
                        style={styles.image}
                        source={require('../back-button-icon-png-25.jpg')}
                    />
              </TouchableOpacity>
            </View>
            <View style={styles.container1}>
                <Text style={styles.textContainer1}>Login</Text>    
            </View>
            <View style={styles.container2}>
                <Text style={styles.textContainer2}>Email:</Text>
                <TextInput
                    style={styles.textInputContainer2}
                    placeholder="Enter Here"
                    placeholderTextColor= "white"
                    value={email}
                    onChangeText={(email) =>
                        this.setState({email: email})
                    }
                />
                <Text style={styles.textContainer2}>Password:</Text>
                <TextInput
                    style={styles.textInputContainer2}
                    placeholder="Enter Here"
                    placeholderTextColor= "white"
                    value={password}
                    onChangeText={(password) =>
                        this.setState({password: password})
                    }
                    secureTextEntry={true}
                />    
            </View>
            <View style={styles.container3}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onLogin()}
                >
                    <Text style={styles.buttonText}>
                        Sign in
                    </Text>
              </TouchableOpacity>
              <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onRegister()}
                >
                    <Text style={styles.buttonText}>
                        Register
                    </Text>
              </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
            :
            <View>
                <Text> Failed </Text>
            </View>
         } 
        </View>
    );
  }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        resizeMode: 'cover',
        width: wp('100%'),
        backgroundColor:'#f98b34'
    },
    //container
    container: {
        borderWidth:1
    },
    image: {
        marginVertical: 5,
        width: wp('10%'),
        height: hp("6.5%"),
        marginHorizontal: 5,
    },
    //container1
    container1: {
        height: hp('20%'),
        // backgroundColor:'red',
        alignItems:'center',
        justifyContent:'center',
    },
    textContainer1:{
        marginHorizontal:10,
        fontSize:28,
        fontWeight:'bold'
    },
    //container2
    container2: {
        height: hp('40%'),
        // backgroundColor:'blue',
    },
    textContainer2:{
        marginHorizontal:10,
        marginVertical:20,
        fontSize:18,
        fontWeight:'bold',
        color:'white'
    },
    textInputContainer2:{
        marginHorizontal:10,
        width: wp('96%'),
        borderWidth:2,
        borderColor:'#67bae3',
        paddingHorizontal:10
    },
    //conatainer3
    container3:{
        height: hp('30%'),
        // backgroundColor:'green',
        alignItems:'center'
    },
    button: {
        marginVertical:10,
        borderWidth:2,
        borderRadius:10,
        borderColor:'#67bae3',
        backgroundColor: '#f39c12',
        width: wp('96%'),
        height:hp('10%'),
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText: {
        marginVertical: 11,
        fontWeight: 'bold',
        color: 'white',
        fontSize: 24,
        alignSelf: 'center',
    },
});
