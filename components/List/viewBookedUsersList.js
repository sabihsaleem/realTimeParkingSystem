import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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

export default class viewBookedUsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      bookedUsersList:[],
    };
  }

  componentDidMount = () => {

    let bookedUsers = this.props.route.params.item.bookedUsers
    let bookedUsersList = [];
    for ( let keybookedUsers in bookedUsers ) {
        const value = {...bookedUsers[keybookedUsers], keybookedUsers};
        bookedUsersList.push(value);
    }

    this.setState({
        bookedUsersList,
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

  delete(index,item) {
    let locationKey = this.props.route.params.locationKey
    let slotKey = this.props.route.params.item.keySlot
    let deleted = 'Location/' + locationKey + '/Slots/' + slotKey + '/bookedUsers/' + item.UserKey
    console.log("delete",deleted)
    firebase.database().ref(deleted).remove();
  }

  render() {
    const {bookedUsersList} = this.state
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
                Booked Users List
              </Text>
            </View>
            <View style={styles.container1}>
              <FlatList
                style={styles.list}
                data={bookedUsersList}
                ListEmptyComponent={() => this.emptyComponent()}
                renderItem={({item, index}) => (
                  <View
                    style={styles.container1FlatlistView}>
                    <View style={{marginVertical: 5}}>
                    
                      <View style={{justifyContent: 'space-between'}}>
                        <Text
                          style={styles.flatListNameText}>
                          {item.name}
                        </Text>
                          <Text
                            style={styles.flatListText}>
                            {item.email}
                          </Text>
                          <Text
                            style={styles.flatListText}>
                            {item.startTime.slice(12,19)}
                          </Text>
                          <Text
                            style={styles.flatListText}>
                            {item.endTime.slice(12,19)}
                          </Text>
                        <Text
                          style={styles.flatListText}>
                          {item.vehicleName}
                        </Text>
                        <Text
                          style={styles.flatListText}>
                          {item.vehicleType}
                        </Text>
                        <Text
                            style={styles.flatListText}>
                            {item.locationType}
                        </Text>
                        <Text
                            style={styles.flatListText}>
                            {item.currentDate}
                        </Text>
                      </View>
                      <View style={styles.flatListContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.delete(index,item)}
                        >
                            <Text style={styles.buttonText}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                      </View>
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
    width: wp('100%'),
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
    marginHorizontal:40,
    width: wp('100%')
  },
  //container1 View
  container1: {
    // height: hp('75%'),
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
  flatListEmailTimeView: {
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