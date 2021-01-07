import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ImageBackground,
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

export default class Registeration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      address: '',
      contactNo: '',
      isLoading: true,
    };
  }

  onRegisteration(name, password, email,address, contactNo){
    if (
        this.state.email &&
        this.state.password &&
        this.state.address &&
        this.state.name &&
        this.state.contactNo
    ) {
        auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
        console.log('User account created & signed in!');
        firebase
            .database()
            .ref('User')
            .push({
            name,
            password,
            email,
            address,
            contactNo,
            isAdmin: false,
            })
            .then(() => {
            this.setState({
                name: '',
                password: '',
                email: '',
                address: '',
                contactNo: '',
            });
            console.log('Data update.');
            alert('Data update.');
            })
            .catch((error) => {
            console.log('failed: ' + error.message);
            });
            this.props.navigation.navigate('Login');
        })
        .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            Alert.alert('Error!', 'That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            Alert.alert('Error!', 'That email address is invalid!');
        }

        console.error(error);
        });
    } else {
    alert('Enter Data Please');
    }
  }
  render() {
    const {name, email, password, address, contactNo} = this.state
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
                    <Text style={styles.textContainer1}>Registeration</Text>    
                </View>
                <View style={styles.container2}>
                    <Text style={styles.textContainer2}>Name:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder="Enter Here"
                        placeholderTextColor= "white"
                        value={name}
                        onChangeText={(name) =>
                            this.setState({name: name})
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
                    />
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
                    <Text style={styles.textContainer2}>Address:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder="Enter Here"
                        placeholderTextColor= "white"
                        value={address}
                        onChangeText={(address) =>
                            this.setState({address: address})
                        }
                    />
                    <Text style={styles.textContainer2}>Contact No:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder="Enter Here"
                        placeholderTextColor= "white"
                        maxLength={14}
                        value={contactNo}
                        onChangeText={(contactNo) =>
                            this.setState({contactNo: contactNo})
                        }
                    />   
                </View>
                <View style={styles.container3}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.onRegisteration(name, password, email,address, contactNo)}
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
        height: hp('5%'),
        // backgroundColor:'red',
        alignItems:'center',
        justifyContent:'center',
    },
    textContainer1:{
        marginHorizontal:10,
        fontSize:28,
        fontWeight:'bold',
    },
    //container2
    container2: {
        height: hp('72%'),
        // backgroundColor:'blue',
    },
    textContainer2:{
        marginHorizontal:10,
        marginVertical:10,
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
        height: hp('15%'),
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
