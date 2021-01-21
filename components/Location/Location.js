import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      locationAddress:'',
      locationName:'',
      locationContactNo:'',
      noFSLots:'',
      locationDetails:'',
    };
  }

  onCreate(locationName, locationDetails, noFSLots, locationAddress, locationContactNo){
    if (
        this.state.locationName &&
        this.state.locationDetails &&
        this.state.noFSLots &&
        this.state.locationAddress &&
        this.state.locationContactNo
    ) {
        firebase
        .database()
        .ref('Location')
        .push({
            locationName,
            locationDetails,
            noFSLots,
            locationAddress,
            locationContactNo,
        })
        .then(() => {
            console.log('Data update.');
            alert('Data update.');
        })
        .catch((error) => {
            console.log('failed: ' + error.message);
        });
        this.props.navigation.navigate('Admin');
    } else {
        alert('Enter Data Please');
    }
  }

  render() {
    const {locationAddress,locationName,locationContactNo,noFSLots,locationDetails} = this.state
    return (
      <View
        style={styles.main}>
        {this.state.isLoading ? (
          <ScrollView>
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
              <Text style={styles.containerTextHeader}>
                Add Location
              </Text>
            </View>

            <View style={styles.container1}>
                <Text style={styles.textContainer1}>Location Name:</Text>
                <TextInput
                    style={styles.textInputContainer1}
                    placeholder="Enter Here"
                    placeholderTextColor= "white"
                    value={locationName}
                    onChangeText={(locationName) =>
                        this.setState({locationName: locationName})
                    }
                />
                <Text style={styles.textContainer1}>Location details:</Text>
                <TextInput
                    style={styles.textInputContainer1}
                    placeholder="Enter Here"
                    placeholderTextColor= "white"
                    value={locationDetails}
                    onChangeText={(locationDetails) =>
                        this.setState({locationDetails: locationDetails})
                    }
                />
                <Text style={styles.textContainer1}>No .of Slots</Text>
                <TextInput
                    style={styles.textInputContainer1}
                    placeholder="Enter Here"
                    placeholderTextColor= "white"
                    value={noFSLots}
                    onChangeText={(noFSLots) =>
                        this.setState({noFSLots: noFSLots})
                    }
                />
                <Text style={styles.textContainer1}>Location Address:</Text>
                <TextInput
                    style={styles.textInputContainer1}
                    placeholder="Enter Here"
                    placeholderTextColor= "white"
                    value={locationAddress}
                    onChangeText={(locationAddress) =>
                        this.setState({locationAddress: locationAddress})
                    }
                />
                <Text style={styles.textContainer1}>Location Contact No:</Text>
                <TextInput
                    style={styles.textInputContainer1}
                    placeholder="Enter Here"
                    placeholderTextColor= "white"
                    maxLength={14}
                    value={locationContactNo}
                    onChangeText={(locationContactNo) =>
                        this.setState({locationContactNo: locationContactNo})
                    }
                />   

            </View>

            <View style={styles.container2}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onCreate(locationName, locationDetails, noFSLots, locationAddress, locationContactNo)}
                >
                    <Text style={styles.buttonText}>
                        Create
                    </Text>
                </TouchableOpacity>
            </View>

          </ScrollView>
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
  main: {
    flex: 1,
    resizeMode: 'cover',
    width: wp('100%'),
    backgroundColor:'#f98b34'
  },
  //container View
  container: {
    borderWidth:1,
    flexDirection:'row',
  },
  image: {
    marginVertical: 5,
    width: wp('10%'),
    height: hp("6.5%"),
    marginHorizontal: 5,
  },
  containerTextHeader:{
    fontSize:28,
    fontWeight:'bold',
    alignSelf:'center',
    marginHorizontal:90
  },
  //container1 View
  container1: {
    height: hp('72%'),
  },
  textContainer1:{
    marginHorizontal:10,
    marginVertical:10,
    fontSize:18,
    fontWeight:'bold',
    color:'white'
  },
  textInputContainer1:{
    marginHorizontal:10,
    width: wp('96%'),
    borderWidth:2,
    borderColor:'#67bae3',
    paddingHorizontal:10
  },
  container2:{
    height: hp('15%'),
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