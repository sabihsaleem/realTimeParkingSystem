import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class Registration extends React.Component {
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
        paddingHorizontal:10,
        color: 'white'
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
