import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
    webClientId:
      '760692111499-88l985a4au0v94t3lg6sd8vbstor5d0f.apps.googleusercontent.com',
});

export default class Home extends React.Component {

    componentDidMount () {
        console.log("this.props", this.props)
        AsyncStorage.getItem('@User').then((
          value => {
          console.log(JSON.parse(value))
          let d = JSON.parse(value)
          let data = [] 
          for (const element in d) {
              // console.log(element);
              value={...d[element],element}
              data.push(
                  value
              )
          }
          console.log("data",data)
          if (value === null) {
            // this.props
            console.log("null")
            this.props.navigation.navigate('Home')
            
          } else {

            if (data[0].isAdmin===true) {
              //redirect to admin
              console.log("Admin")
              this.props.navigation.navigate('Admin')
            }
            else {
              //redirect to User
              console.log("User")
              this.props.navigation.navigate('User')
            }
            
          }
        }))
    
    }

    async onFacebookButtonPress() {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions([
          'email',
        ]);
    
        if (result.isCancelled) {
          throw 'User cancelled the login process';
        }
    
        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();
    
        if (!data) {
          throw 'Something went wrong obtaining access token';
        }
    
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(
          data.accessToken,
        );
        console.log('facebookCredential', facebookCredential);
        // Sign-in the user with the credential
        let array = []
        return firebase
          .auth()
          .signInWithCredential(facebookCredential)
          .then( async (data) => {
            console.log('data', data.user.displayName);
            let datalist = []
            let value = {
                name:  data.user.displayName,
                email:  data.user.email,
                isAdmin: false,
            }
            datalist.push(value)
            console.log(datalist,'datalist')
            try {
                var currentUser = datalist;
                await AsyncStorage.setItem(
                  '@User',
                  JSON.stringify(currentUser),
                );
            } catch (err) {
                console.log('err', err);
            }
            firebase.database()
            .ref('User')
            .child(data.user.uid)
            .set({
                name:  data.user.displayName,
                email:  data.user.email,
                isAdmin: false,
            })
            .then(() => {
                console.log('Data update.');
            })
            .catch((error) => {
                console.log('failed: ' + error.message);
            });
            this.props.navigation.navigate("Facebook")
          });
    }

    async onGoogleButtonPress() {
        const {idToken} = await GoogleSignin.signIn();
    
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        console.log('googleCredential', googleCredential);
    
        return firebase
        .auth()
        .signInWithCredential(googleCredential)
        .then( async (data) => {
          console.log('data', data);
          let datalist = []
          let value = {
              name:  data.user.displayName,
              email:  data.user.email,
              isAdmin: false,
              providerId: data.user.providerData[0].providerId,
          }
          datalist.push(value)
          console.log(datalist,'datalist')
          try {
              var currentUser = datalist;
              await AsyncStorage.setItem(
                '@User',
                JSON.stringify(currentUser),
              );
          } catch (err) {
              console.log('err', err);
          }
          firebase.database()
          .ref('User')
          .child(data.user.uid)
          .set({
              name:  data.user.displayName,
              email:  data.user.email,
              isAdmin: false,
              providerId: data.user.providerData[0].providerId,
          })
          .then(() => {
              console.log('Data update.');
          })
          .catch((error) => {
              console.log('failed: ' + error.message);
          });
          this.props.navigation.navigate("Facebook")
        });
    }

    login () {
        this.props.navigation.navigate("Login")
    }

    registration () {
        this.props.navigation.navigate("Registration")
    }

    render(){
        return(
            <View style={styles.main}>
                <View style={styles.container1}>
                    <Text style={styles.textHeader}>Welcome</Text>
                </View>
                <View style={styles.container2}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={ ()=> this.login ()}
                        >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={ ()=> this.registration ()}
                        >
                        <Text style={styles.buttonText}>Registration</Text>
                    </TouchableOpacity>
                    <View style={styles.otherSigninOptions}>
                        <Text style={styles.otherSigninOptionsText}>Other Signin Options</Text>
                    </View>
                </View>
                <View style={styles.container3}>
                    <TouchableOpacity
                        style={styles.otherSigninOptionsButton}
                        onPress={() => this.onGoogleButtonPress() }
                        >
                        <View style={{flexDirection: 'row'}}>
                            <Image style={styles.image} source={require('../google.png')} />
                            <Text style={styles.otherSigninOptionsButtonText}>Google</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.otherSigninOptionsButton}
                        onPress={() => this.onFacebookButtonPress() }
                        >
                        <View style={{flexDirection: 'row'}}>
                            <Image style={styles.image} source={require('../facebook.png')} />
                            <Text style={styles.otherSigninOptionsButtonText1}>Facebook</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        resizeMode: 'cover',
        width: wp('100%'),
        backgroundColor:'#f98b34'
    },
    // container1
    container1: {
        height: hp('30%'),
        alignItems:'center',
        justifyContent:'center',
    },
    textHeader: {
        fontSize: 36,
        fontWeight:'bold',
    },
    // container2
    container2: {
        height: hp('17%'),
        alignItems:'center',
        marginVertical:50,
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
        fontSize: 26,
        fontWeight:'bold',
        color:'white',
    },
    otherSigninOptions: {
        alignItems:'center',
        justifyContent:'center',
    },
    otherSigninOptionsText: {
        fontSize: 24,
    },
    // container2
    container3: {
        alignItems:'center',
        marginVertical:50,
    },
    otherSigninOptionsButton: {
        marginVertical:10,
        borderWidth:2,
        borderRadius:10,
        borderColor:'#67bae3',
        backgroundColor: '#f39c12',
        width: wp('96%'),
        height:hp('10%'),
        // alignItems:'center',
        justifyContent:'center'
    },
    otherSigninOptionsButtonText: {
        fontSize: 26,
        fontWeight:'bold',
        color:'white',
        alignSelf: 'center',
        marginHorizontal: 95
    },
    otherSigninOptionsButtonText1: {
        fontSize: 26,
        fontWeight:'bold',
        color:'white',
        alignSelf: 'center',
        marginHorizontal: 80
    },
    image: {
        width: wp('10%'),
        height: hp("6.5%"),
        marginHorizontal: 10
    },
});