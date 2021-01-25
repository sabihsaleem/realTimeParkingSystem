import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';

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

    const sDate = new Date(date.getTime());
    sDate.setSeconds(0);
    sDate.setMilliseconds(0);

    const eDate = new Date(date.getTime());
    eDate.setSeconds(0);
    eDate.setMilliseconds(0);
    eDate.setMilliseconds(3540000);

    let startDateTime = sDate.getHours()+':'+sDate.getMinutes()+':'+sDate.getSeconds()
    let endDateTime = eDate.getHours()+':'+eDate.getMinutes()+':'+eDate.getSeconds()

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
      startTime: startDateTime,
      endTime: endDateTime,
      startTimeStamp: sDate.getTime(),
      endTimeStamp: eDate.getTime(),
    });
  };

  componentDidMount() {
    const user = auth().currentUser;
    let key = this.props.route.params.item.key
    let locationType = this.props.route.params.item.locationName
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
        this.setState({
          name: currentUser[0].name,
          email: currentUser[0].email,
          key: currentUser[0].key,
          currentUser,
        });
      });
    firebase
      .database()
      .ref('Location/'+locationKey+'/Slots/'+key+'/bookedUsers')
      .on('value', (snapshot) => {
        const getValue = snapshot.val();
        let array = [];
        for ( let key in getValue ) {
          const value = {...getValue[key], key};
          array.push(value);
        }
        this.setState({array});
      });
  }

  onAddBooking = (
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
  ) => {
    if ( 
      this.state.currentDate &&
      this.state.startTime &&
      this.state.endTime &&
      this.state.locationType &&
      this.state.locationType &&
      this.state.vehicleType &&
      this.state.vehicleName
    ) {
      
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
    else {
      alert('Enter Data Please');
    }
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
                style={{ backgroundColor: '#f98b34',borderColor: '#67bae3',borderWidth:2, }}
                itemStyle={{ justifyContent: 'flex-start', }}
                dropDownStyle={{ backgroundColor: '#f17b30', color: 'white' }}
                labelStyle={{ textAlign: 'left',color: 'white' }}
                placeholderStyle={{ color: 'white' }}
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
    color: 'white',
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
