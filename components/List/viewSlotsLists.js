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

export default class viewSlotsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      SlotsList:[],
    };
  }

  componentDidMount = () => {
    console.log("this.props.route.params.item.Slots",this.props.route.params.item.Slots)
    let slots = this.props.route.params.item.Slots
    let SlotsList = [];
    for (let keySlot in slots) {
        // console.log("key", key)
        const value = {...slots[keySlot], keySlot};
        SlotsList.unshift(value);
    }
    console.log(SlotsList, 'SlotsList');
    this.setState({
        SlotsList,
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

  viewBookedUsersList(item,index) {
    this.props.navigation.navigate('viewBookedUsersList',{
        item,
    });
  }

  delete(index,item) {
    let deleted = 'bookedUsers/' + item.key
    console.log("delete",deleted)
    firebase.database().ref(deleted).remove();
  }

  render() {
    const {SlotsList} = this.state
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
                Slots List
              </Text>
            </View>
            <View style={styles.container1}>
              <FlatList
                style={styles.list}
                data={SlotsList}
                ListEmptyComponent={() => this.emptyComponent()}
                renderItem={({item, index}) => (
                  <View
                    style={styles.container1FlatlistView}>
                    <View style={{marginVertical: 5}}>
                    
                      <View style={{justifyContent: 'space-between'}}>
                        <Text
                          style={styles.flatListnoFSLotsText}>
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
                        style={styles.button}
                        onPress={() => this.viewBookedUsersList(item,index)}>
                        <Text style={styles.buttonText}> Slot List</Text>
                        </TouchableOpacity>
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
    marginHorizontal:100,
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
  flatListnoFSLotsText: {
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
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