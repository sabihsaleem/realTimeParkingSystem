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

export default class viewSlots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      viewSlotsData: [],
      bookingKey: null,
      BookingKey:null,
      key:'',
      data:[],
    };
  }

  componentDidMount = () => {
    let sloted = this.props.route.params.item.Slots
    let viewSlotsData = [];

    for (let key in sloted ) {
        const value = {...sloted[key],key}
        viewSlotsData.push(value);
    }
    this.setState ({
        viewSlotsData,
    });

    const user = auth().currentUser;
    
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

        let BookingValue = currentUser[0].Booking
        if ( BookingValue===undefined ) {
          this.setState({
              name: currentUser[0].name,
              BookingKey: null,
              key: currentUser[0].key,
          });
        }else {
          let BookingData = []
          for( let BookingKey in BookingValue ){
              const value = {...BookingValue[BookingKey],BookingKey}
              BookingData.push(value)
          }

          this.setState ({
              name: currentUser[0].name,
              BookingKey: BookingData[0].BookingKey,
              key: currentUser[0].key,
          });
        }
    });

    firebase
    .database()
    .ref('Location')
    .on('value', (snapshot) => {
      const getValue = snapshot.val();
      let arrayLocation = [];
      for ( let keyLocation in getValue ) {
        const value = {...getValue[keyLocation], keyLocation};
        arrayLocation.push(value);
      }
      let data = []
      for ( let keydata of arrayLocation ) {

        if ( keydata.Slots ) {

          let slots = keydata.Slots

          for ( let keydataSlots in slots ) {

            if ( slots[keydataSlots].bookedUsers ) {

              let bookedUsers = slots[keydataSlots].bookedUsers

              for ( let key in bookedUsers ) {

                if ( bookedUsers[key].email.toLowerCase()===user.email.toLowerCase() ) {
                  console.log('true')
                  const value = {...bookedUsers[key],key};
                  data.push(value)
                }else {
                  console.log('false')
                  const value = {...bookedUsers[key],key};
                  data.push(value)
                }
              }
            }
          }
        }
      }
      console.log('data',data)

      this.setState({
        data,
      })

    });
  };

  emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: wp('100%'),
          height: hp('100%'),
        }}>
        <TouchableOpacity onPress={ () => this.props.navigation.goBack() }>
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

  addBooking (index,item) {

    let dataList = this.state.data.filter((el)=> el.UserKey===this.state.key )

    if( dataList.length===0 ) {
      console.log('undefined')

      this.props.navigation.navigate('ADDBooking',{
        item,
        locationKey:this.props.route.params.item.key
      })

    }else{

      if ( dataList[0].UserKey===this.state.key ) {

        alert('You already booked in this Location')

      }else {

        this.props.navigation.navigate('ADDBooking',{
          item,
          locationKey:this.props.route.params.item.key
        })

      }
    }
  }

  cancelBooking(index,item) {
    console.log('this.props',this.props.route.params.item.key)
    console.log('item',item.key)
    if ( item?.bookedUsers[this.state.key] ) {
      console.log("if", item?.bookedUsers[this.state.key].UserKey)
    }else {
      console.log("not found")
    }
    let keyBooked = item?.bookedUsers[this.state.key].UserKey
    let deleted = 'Location/'+this.props.route.params.item.key+'/Slots/'+item.key+'/bookedUsers/'+keyBooked
    console.log("delete",deleted)
    firebase.database().ref(deleted).remove();
    console.log(this.state.BookingKey,this.state.key)
    let deletes = 'User/'+this.state.key+'/Booking/'+this.state.BookingKey
    console.log("delete",deletes)
    firebase.database().ref(deletes).remove();
    this.props.navigation.navigate('User')
  }

  render() {
    const {viewSlotsData,bookingKey,BookingKey,key,data} = this.state

    viewSlotsData.sort((a, b) => { return a.noFSLots - b.noFSLots; })

    return (
      <View
        style={styles.main}>
        {this.state.isLoading ? (
          <View>
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
            <ScrollView>
              <View style={styles.container1}>
                <FlatList
                  style={styles.list}
                  data={viewSlotsData}
                  ListEmptyComponent={() => this.emptyComponent()}
                  renderItem={({item, index}) => (
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
                        {
                          key && item?.bookedUsers && item?.bookedUsers[key] != undefined
                          ?
                          <View style={styles.flatListContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.cancelBooking(index,item)}
                            >
                                <Text style={styles.buttonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                          </View>
                          : null
                        }
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => `${index}`}
                />
              </View>
            </ScrollView>
          </View>
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
    // height: hp('150%'),
  },
  list: {
    width: wp('100%'),
    paddingBottom: 60,

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