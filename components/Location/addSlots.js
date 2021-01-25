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
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class addSlots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      locationAddress:'',
      locationName:'',
      locationContactNo:'',
      noFSLots:'',
      locationKey:'',
      SlotsList:[],
    };
  }

  componentDidMount = () => {

    let data = this.props.route.params.item
    let locationData = [];

    locationData.push(data);

    let slots = locationData[0].Slots
    let SlotsList = [];

    for ( let keySlot in slots ) {
        // console.log("key", key)
        const value = {...slots[keySlot], keySlot};
        SlotsList.unshift(value);
    }

    this.setState({
       locationAddress:locationData[0].locationAddress,
       locationName:locationData[0].locationName,
       locationContactNo:locationData[0].locationContactNo,
       locationKey:locationData[0].key,
       SlotsList,
    });

  };

  onCreate (
    locationName,
    noFSLots, 
    locationAddress, 
    locationContactNo
  ) {

    let slot = this.state.SlotsList.length+1
      if( slot>=11 ) {  

        this.props.navigation.navigate('LocationView');
        Alert.alert("Warning!","Maximum Slots Capacity Reached")

      }else {
        firebase
        .database()
        .ref('Location/'+this.state.locationKey+'/Slots')
        .push({
            locationName,
            noFSLots:slot.toString(),
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
      }
  }

  render() {
    const {locationAddress,locationName,locationContactNo,noFSLots,SlotsList} = this.state
    let slot = SlotsList.length+1
    
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
                Add Slots
              </Text>
            </View>

            <View style={styles.container1}>
                <Text style={styles.textContainer1}>Location Name:</Text>
                <TextInput
                    style={styles.textInputContainer1}
                    placeholder={locationName}
                    placeholderTextColor= "white"
                    value={locationName}
                    editable={false}
                />
                <Text style={styles.textContainer1}>Slots No</Text>
                <TextInput
                    style={styles.textInputContainer1}
                    placeholder={slot.toString()}
                    placeholderTextColor= "white"
                    editable={false}
                />
                <Text style={styles.textContainer1}>Location Address:</Text>
                <TextInput
                    style={styles.textInputContainer1}
                    placeholder={locationAddress}
                    placeholderTextColor= "white"
                    editable={false}
                />
                <Text style={styles.textContainer1}>Location Contact No:</Text>
                <TextInput
                    style={styles.textInputContainer1}
                    placeholder={locationContactNo}
                    placeholderTextColor= "white"
                    maxLength={14}
                    editable={false}
                />   

            </View>

            <View style={styles.container2}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onCreate(locationName, noFSLots, locationAddress, locationContactNo)}
                >
                    <Text style={styles.buttonText}>
                        Add
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
    height: hp('60%'),
    marginVertical:30
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
    paddingHorizontal:10,
    color:'white'
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