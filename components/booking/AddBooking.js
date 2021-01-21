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
import DateTimePicker from 'react-native-modal-datetime-picker';

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

export default class AddBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      isLoading: true,
      vehicleName: '',
      vehicleType: null,
      key: '',
      isDateTimePickerVisible: false,
      currentDate: '',
      currentUser: [],
      array: [],
      selected: false,
      startTime: null,
      endTime: null,
      startTimeStamp: null,
      endTimeStamp: null,
      bookedTime: null,
      locationType: null,
      key:'',
    };
  }

  changeVehicleType(item) {
    console.log('vehicleTypeItem', item.label, item, item.value);
    this.setState({
      vehicleType: item.label,
    });
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = (date) => {
    let d = new Date();
    let weekday = new Array(7);
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';
    // console.log('A date has been picked: ', date);
    // console.log(
    //   date.getHours(),
    //   ':',
    //   date.getMinutes(),
    //   ':',
    //   date.getSeconds(),
    //   'time',
    //   date.getTime(),
    // );

    const sDate = new Date(date.getTime());
    sDate.setSeconds(0);
    sDate.setMilliseconds(0);

    const eDate = new Date(date.getTime());
    eDate.setSeconds(0);
    eDate.setMilliseconds(0);
    eDate.setMilliseconds(3540000);
    console.log("Array",this.state.array)
    // console.log(sDate, 'eDate/n',eDate);

    console.log(
      sDate.getTime(),
      'sDate.getTime()',
      eDate.getTime(),
      'eDate.getTime()',
    );

    let x = this.state.array.filter((value) => {
      const current = new Date();
      current.setMilliseconds(0);
      current.setSeconds(0);

      const cond =
        current.getTime() >= value.startTimeStamp &&
        current.getTime() <= value.endTimeStamp;
      if (cond) {
        console.log("you cannot book now")
        alert("Already in use")
        this.setState({bookedTime:true})
      } else{
        console.log("you can book now")
        this.setState({bookedTime:false})
      }
    });
    // for (let x in this.state.array) {
    //   // console.log('array[x]',this.state.array[x])\
    //   // if(this.state.array[x].startTimeStamp<=eDate.getTime()){
    //   //   console.log('true')
    //   //   alert("Already in use")
    //   //   this.setState({bookedTime:true})
    //   //   break
    //   // }else{
    //   //   console.log('false')
    //   //   this.setState({bookedTime:false})
    //   // }
    // }

    // let zzz = this.state.array.filter(el=>el.startTimeStamp === sDate.getTime())
    // console.log(zzz)

    // console.log(
    //   date.getFullYear() +
    //     ' ' +
    //     (date.getMonth() + 1) +
    //     '/' +
    //     date.getDate() +
    //     '  ' +
    //     weekday[d.getDay()],
    // );
    let dateSelected =
      date.getFullYear() +
      ' ' +
      (date.getMonth() + 1) +
      '/' +
      date.getDate() +
      '  ' +
      weekday[d.getDay()];
    this.hideDateTimePicker();
    this.setState({
      currentDate: dateSelected,
      startTime: sDate,
      endTime: eDate,
      startTimeStamp: sDate.getTime(),
      endTimeStamp: eDate.getTime(),
    });
  };

  componentDidMount() {
    const user = auth().currentUser;
    console.log('this.props.route.params.item.key', this.props.route.params.item.key);
    console.log('this.props.route.params.locationKey', this.props.route.params.locationKey);
    let key = this.props.route.params.item.key
    let locationType = this.props.route.params.item.locationName
    console.log('locationType',locationType );
    this.setState({
      key,
      locationType,
    })
    console.log('user', user);
    firebase
      .database()
      .ref('User')
      .on('value', (snapshot) => {
        // console.log("snapshot.val()", snapshot.val())
        const getValue = snapshot.val();
        // console.log("getValue", getValue)
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
        // console.log('currentUser', currentUser);
        this.setState({
          name: currentUser[0].name,
          email: currentUser[0].email,
          key: currentUser[0].key,
          currentUser,
        });
      });
    firebase
      .database()
      .ref('Location/'+this.props.route.params.locationKey+'/Slots/'+this.props.route.params.item.key+'/bookedUsers')
      .on('value', (snapshot) => {
        console.log("bookedUsers.val()", snapshot.val())
        const getValue = snapshot.val();
        // console.log("bookedUsers", getValue)
        let array = [];
        for (let key in getValue) {
          // console.log("key", key)
          const value = {...getValue[key], key};
          array.push(value);
        }
        console.log(array, 'arraybookedUsers');
        this.setState({array});
      });
  }

  onAddBooking(
    key,
    name,
    email,
    vehicleName,
    vehicleType,
    locationType,
    startTime,
    endTime,
    startTimeStamp,
    endTimeStamp,
    currentDate,
  ) {
    // if (this.state.bookedTime === true) {
    //   console.log('true', this.state.bookedTime);
    //   alert('Change your selected time');
    // } else {
    //   console.log('false', this.state.bookedTime);
    // }
    firebase
    .database()
    .ref('User/' + this.state.key + '/Booking')
    .push({
      UserKey: key,
      vehicleName,
      vehicleType,
      locationType,
      currentDate,
      startTime,
      endTime,
    })
    .then(() => {
      firebase
        .database()
        .ref('Location/'+this.props?.route?.params?.locationKey+'/Slots/'+this.props?.route?.params?.item?.key+'/bookedUsers')
        .child(this.state.key)
        .set({
          UserKey: key,
          name,
          email,
          vehicleName,
          vehicleType,
          locationType,
          startTime,
          endTime,
          startTimeStamp,
          endTimeStamp,
          currentDate,
        })
        .then((err) => {
          console.log(err, 'Data update.');
        })
        .catch((error) => {
          console.log('Failed: ' + error.message);
        });
      console.log('Data update.');
      alert('Data update.');
      this.props?.navigation?.navigate('User');
    })
    .catch((error) => {
      console.log('failed: ' + error.message);
    });
    
  }

  render() {
    const {
      key,
      name,
      email,
      vehicleName,
      vehicleType,
      locationType,
      startTime,
      endTime,
      currentDate,
      startTimeStamp,
      endTimeStamp,
      bookedTime,
    } = this.state;
    console.log('bookedTime', bookedTime,locationType);
    return (
      <View style={styles.main}>
        {this.state.isLoading ? (
          <KeyboardAwareScrollView>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
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
                placeholderTextColor="white"
                editable={false}
              />
              <Text style={styles.textContainer2}>Email:</Text>
              <TextInput
                style={styles.textInputContainer2}
                placeholder={email}
                placeholderTextColor="white"
                editable={false}
              />
              <Text style={styles.textContainer2}>Vehicle Name:</Text>
              <TextInput
                style={styles.textInputContainer2}
                placeholder="Enter Here"
                placeholderTextColor="white"
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
                containerStyle={{
                  height: hp('8%'),
                  width: wp('96%'),
                  alignSelf: 'center',
                }}
                style={{backgroundColor: '#f98b34',borderColor: '#67bae3',borderWidth:2}}
                itemStyle={{
                  justifyContent: 'flex-start',color: 'white'
                }}
                dropDownStyle={{backgroundColor: '#f98b34',borderColor: '#67bae3',borderWidth:2}}
                labelStyle={{textAlign: 'left',color: 'white'}}
                onChangeItem={(item) => this.changeVehicleType(item)}
              />
              <Text style={styles.textContainer2}>Location:</Text>
              <TextInput
                style={styles.textInputContainer2}
                placeholder={locationType}
                placeholderTextColor="white"
                editable={false}
              />
              <Text style={styles.textContainer2}>Date:</Text>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TextInput
                  style={{
                    marginHorizontal: 10,
                    width: wp('82%'),
                    borderWidth: 2,
                    borderColor: '#67bae3',
                    paddingHorizontal: 10,
                  }}
                  placeholder={currentDate}
                  placeholderTextColor="white"
                  editable={false}
                />

                <TouchableOpacity
                  style={{marginRight: 100}}
                  onPress={this.showDateTimePicker}>
                  <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    mode="datetime"
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                  />
                  <Image
                    style={{width: 46, height: 50, marginRight: 5}}
                    source={require('../../small.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.container3}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  this.onAddBooking(
                    key,
                    name,
                    email,
                    vehicleName,
                    vehicleType,
                    locationType,
                    startTime,
                    endTime,
                    startTimeStamp,
                    endTimeStamp,
                    currentDate,
                  )
                }>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        ) : (
          <View>
            <Text> Failed </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    resizeMode: 'cover',
    width: wp('100%'),
    backgroundColor: '#f98b34',
  },
  //container
  container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginVertical: 5,
    width: wp('10%'),
    height: hp('6.5%'),
    marginHorizontal: 5,
  },
  textContainer: {
    marginHorizontal: 80,
    fontSize: 28,
    fontWeight: 'bold',
  },
  //container2
  container2: {
    // backgroundColor:'blue',
  },
  textContainer2: {
    marginHorizontal: 10,
    marginVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  textInputContainer2: {
    marginHorizontal: 10,
    width: wp('96%'),
    borderWidth: 2,
    borderColor: '#67bae3',
    paddingHorizontal: 10,
  },
  //conatainer3
  container3: {
    height: hp('15%'),
    // backgroundColor:'green',
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#67bae3',
    backgroundColor: '#f39c12',
    width: wp('96%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginVertical: 11,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
    alignSelf: 'center',
  },
});
