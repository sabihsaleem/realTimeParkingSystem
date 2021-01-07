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
import DropDownPicker from 'react-native-dropdown-picker';

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

export default class AddBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      isLoading: true,
      vehicleName: '',
      vehicleType: null,
      time: null,
      key:'',
    };
  }

  changeTime(item) {
    console.log("item",item.label,item,item.value)
    this.setState({
        time:item.label,
    });
  }

  changeVehicleType(item) {
    console.log("vehicleTypeItem",item.label,item,item.value)
    this.setState({
        vehicleType:item.label,
    });
  }

  componentDidMount(){
    const user = auth().currentUser;
    console.log('user', user);
    firebase
      .database()
      .ref('User')
      .on('value', (snapshot) => {
        console.log("snapshot.val()", snapshot.val())
        const getValue = snapshot.val();
        console.log("getValue", getValue)
        let array = [];
        for (let key in getValue) {
          // console.log("key", key)
          const value = {...getValue[key], key};
          array.push(value);
        }
        console.log(array, 'array');
        const currentUser = array.filter(
          (el) => el.email.toLowerCase() === user.email.toLowerCase(),
        );
        console.log('currentUser[0].name', currentUser);
        this.setState({
          name: currentUser[0].name,
          email: currentUser[0].email,
          key:currentUser[0].key
        });
      });
  }

  onAddBooking(key, name, email, vehicleName, vehicleType, time){
    console.log("this.state.time",this.state.time)
    console.log("this.state.vehicleType",this.state.vehicleType)
    firebase
    .database()
    .ref('User/'+this.state.key+'/Booking')
    .push({
        UserKey: key,
        vehicleName,
        vehicleType,
        time,
    })
    .then(() => {
        firebase
        .database()
        .ref('bookedUsers')
        .push({
            UserKey: key,
            name,
            email,
            vehicleName,
            vehicleType,
            time
        })
        .then((err) => {
            console.log(err,'Data update.');
        })
        .catch((error) => {
            console.log('Failed: ' + error.message);
        });
        console.log('Data update.');
        alert('Data update.');
        this.props.navigation.navigate('User');
    })
    .catch((error) => {
        console.log('failed: ' + error.message);
    });
  }

  render() {
    const {name, email, vehicleName, vehicleType, time, key} = this.state
    console.log("time",time)
    return (
        <View style={styles.main}>
        {this.state.isLoading ?
            <KeyboardAwareScrollView>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    >
                        <Image
                            style={styles.image}
                            source={require('../../back-button-icon-png-25.jpg')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.textContainer}>Add Booking</Text>
                </View>
                <View style={styles.container2}>
                    <Text style={styles.textContainer2}>Name:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder={name}
                        placeholderTextColor= "white"
                        editable={false}
                    />
                    <Text style={styles.textContainer2}>Email:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder={email}
                        placeholderTextColor= "white"
                        editable={false}
                    />
                    <Text style={styles.textContainer2}>Vehicle Name:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder="Enter Here"
                        placeholderTextColor= "white"
                        value={vehicleName}
                        onChangeText={(vehicleName) =>
                            this.setState({vehicleName: vehicleName})
                        }
                    />
                    <Text style={styles.textContainer2}>Vehicle Type:</Text>
                    <DropDownPicker
                        items={[
                            {label: 'Car', value: '0'},
                            {label: 'Bus', value: '1'},
                            {label: 'Bike', value: '2'},
                            {label: 'Truck', value: '3'},
                            {label: 'Van', value: '4'},
                        ]}
                        defaultNull
                        placeholder="Select your Vehicle type"
                        containerStyle={{height: hp('8%'),width: wp('96%'),alignSelf:'center'}}
                        onChangeItem={item => this.changeVehicleType(item)}
                    />
                    <Text style={styles.textContainer2}> Select your Time</Text>
                    <DropDownPicker
                        items={[
                            {label: '00:00 - 00:59 ', value: '0'},
                            {label: '01:00 - 01:59', value: '1'},
                            {label: '02:00 - 02:59', value: '2'},
                            {label: '03:00 - 03:59 ', value: '3'},
                            {label: '04:00 - 04:59', value: '4'},
                            {label: '05:00 - 05:59', value: '5'},
                            {label: '06:00 - 06:59 ', value: '6'},
                            {label: '07:00 - 07:59', value: '7'},
                            {label: '08:00 - 08:59', value: '8'},
                            {label: '09:00 - 09:59 ', value: '9'},
                            {label: '10:00 - 10:59', value: '10'},
                            {label: '11:00 - 11:59', value: '11'},
                            {label: '12:00 - 12:59 ', value: '12'},
                            {label: '13:00 - 13:59', value: '13'},
                            {label: '14:00 - 14:59', value: '14'},
                            {label: '15:00 - 15:59 ', value: '15'},
                            {label: '16:00 - 16:59', value: '16'},
                            {label: '17:00 - 17:59', value: '17'},
                            {label: '18:00 - 18:59 ', value: '18'},
                            {label: '19:00 - 19:59', value: '19'},
                            {label: '20:00 - 20:59', value: '20'},
                            {label: '21:00 - 21:59 ', value: '21'},
                            {label: '22:00 - 22:59', value: '22'},
                            {label: '23:00 - 23:59', value: '23'},
                        ]}
                        defaultNull
                        placeholder="Select your Time"
                        containerStyle={{height: hp('8%'),width: wp('96%'),alignSelf:'center'}}
                        onChangeItem={item => this.changeTime(item)}
                    />                       
                </View>
                <View style={styles.container3}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.onAddBooking(key, name, email, vehicleName, vehicleType, time)}
                    >
                        <Text style={styles.buttonText}>
                            Submit
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
        borderWidth:1,
        flexDirection:'row',
        alignItems:'center',
    },
    image: {
        marginVertical: 5,
        width: wp('10%'),
        height: hp("6.5%"),
        marginHorizontal: 5,
    },
    textContainer:{
        marginHorizontal:60,
        fontSize:28,
        fontWeight:'bold',
    },
    //container2
    container2: {
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
