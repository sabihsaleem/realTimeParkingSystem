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

export default class viewSlots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      viewSlotsData: [],
      bookingKey: null,
      BookingKey:null,
      key:'',
    };
  }

  componentDidMount = () => {
    // console.log('user', this.props.route.params.item.Slots);
    // console.log('this.props.route.params.item.key', this.props.route.params.item.key);
    let sloted = this.props.route.params.item.Slots
    let viewSlotsData = [];
    for(let key in sloted ){
        const value = {...sloted[key],key}
        viewSlotsData.push(value);
    }
    // console.log(viewSlotsData, 'viewSlotsData');
    this.setState({
        viewSlotsData,
    });
    const user = auth().currentUser;
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
        console.log('currentUser', currentUser);
        console.log('currentUser[0].key', currentUser[0].key);
        let BookingValue = currentUser[0].Booking
        if(BookingValue===undefined){
          this.setState({
              name: currentUser[0].name,
              BookingKey: null,
              key: currentUser[0].key,
          });
        }else{
          let BookingData = []
          for(let BookingKey in BookingValue){
              const value = {...BookingValue[BookingKey],BookingKey}
              BookingData.push(value)
          }
          // console.log("BookingData",BookingData)
          // console.log("BookingData[0].BookingKey",BookingData[0].BookingKey)

          this.setState({
              name: currentUser[0].name,
              BookingKey: BookingData[0].BookingKey,
              key: currentUser[0].key,
          });
        }
    });
  };

  emptyComponent = () => {
    // if(this.state.list.length===null){
    //   this.props.navigation.goBack();

    // }
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: wp('100%'),
          height: hp('100%'),
        }}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <View>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 26,
                marginBottom: 100,
              }}>
              oops! There's no data here!
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  addBooking(index,item) {
    { 
        item.bookedUsers ? 
        alert('You already booked in this Location')
        : 
        this.props.navigation.navigate('ADDBooking',{
            item,
            locationKey:this.props.route.params.item.key
        }) 
            
    }
  }

  cancelBooking(index,item) {
    let deleted = item.key
    console.log("delete",deleted)
    // firebase.database().ref(deleted).remove();
  }

  render() {
    const {viewSlotsData,bookingKey,BookingKey,key} = this.state
    console.log('key',key)
    viewSlotsData.sort((a, b) => { return a.noFSLots - b.noFSLots; })
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
                Available Slots
              </Text>
            </View>
            <View style={styles.container1}>
              <FlatList
                style={styles.list}
                data={viewSlotsData}
                ListEmptyComponent={() => this.emptyComponent()}
                renderItem={({item, index}) => (
                    // console.log("flateList", item.bookedUsers),
                  <View
                    style={styles.container1FlatlistView}>
                    <View style={{marginVertical: 5}}>
                    
                      <View style={{justifyContent: 'space-between'}}>
                        <Text
                          style={styles.flatListNameText}>
                          {item.noFSLots.toUpperCase()}
                        </Text>
                        <Text
                            style={styles.flatListText}>
                            {item.locationName}
                        </Text>
                        <Text
                          style={styles.flatListText}>
                          {item.locationAddress}
                        </Text>
                        <Text
                          style={styles.flatListText}>
                          {item.locationContactNo}
                        </Text>
                      </View>
                      <View style={styles.flatListContainer}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: item.bookedUsers ? 'red' : '#f39c12' ,
                                borderRadius: 10,
                                marginVertical: 5,
                                marginHorizontal: 10,
                                alignItems: 'center',
                                width: wp('85%'),
                                height: 40,
                                justifyContent: 'center',
                                borderColor: 'white',
                                borderWidth: 2,
                            }}
                            onPress={() => this.addBooking(index,item)}
                            disabled={item.bookedUsers}
                        >
                            <Text style={styles.buttonText}>
                                {  item.bookedUsers ? "Booked" : "Add Booking"}
                            </Text>
                        </TouchableOpacity>
                      </View>
                      {(key) ?
                        <View style={styles.flatListContainer}>
                          <TouchableOpacity
                              style={{
                                  borderRadius: 10,
                                  marginVertical: 5,
                                  marginHorizontal: 10,
                                  alignItems: 'center',
                                  width: wp('85%'),
                                  height: 40,
                                  justifyContent: 'center',
                                  borderColor: 'white',
                                  borderWidth: 2,
                              }}
                              onPress={() => this.cancelBooking(index,item)}
                          >
                              <Text style={styles.buttonText}>
                                  Cancel
                              </Text>
                          </TouchableOpacity>
                        </View>
                        :
                        null
                      }
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => `${index}`}
              />
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
    marginHorizontal:70
  },
  //container1 View
  container1: {
    // height: hp('100%'),
  },
  list: {
    width: wp('100%'),
  },
  container1FlatlistView: {
    borderRadius: 15,
    marginVertical: 5,
    borderWidth: 2,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#e06100',
    borderColor: '#67bae3',
  },
  flatListNameText: {
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  flatListEmailContactNoView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 5,
    borderWidth: 0.5,
  },
  flatListText: {
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 18,
  },
  flatListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  button: {
    backgroundColor:'#f39c12',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    width: wp('85%'),
    height: 40,
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
  },
});