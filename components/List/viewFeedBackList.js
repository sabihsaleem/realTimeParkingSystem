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

export default class viewFeedBackList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      viewFeedBackList:[],
      feedBackKey:'',
    };
  }
  componentDidMount = () => {
    const user = auth().currentUser;
    console.log('user', user);
    firebase
      .database()
      .ref('User')
      .on('value', (snapshot) => {
        console.log("snapshot.val()", snapshot.val())
        const getValue = snapshot.val();
        console.log("getValue", getValue)
        let viewList = [];
        for (let key in getValue) {
          // console.log("key", key)
          const value = {...getValue[key], key};
          viewList.push(value);
        }
        console.log(viewList, 'viewList');
        const FeedBack = viewList.filter(el => el.email === user.email)
        console.log("key", FeedBack)
        this.setState({
            feedBackKey:FeedBack[0].key,
        });
      });
    //   firebase
    //   .database()
    //   .ref('User/',this.state.feedBackKey,'/FeedBack')
    //   .on('value', (snapshot) => {
    //     console.log("viewFeedBackList.val()", snapshot.val())
    //     const getValue = snapshot.val();
    //     console.log("viewFeedBackListgetValue", getValue)
    //     let viewFeedBackList = [];
    //     for (let key in getValue) {
    //       // console.log("key", key)
    //       const value = {...getValue[key], key};
    //       viewFeedBackList.push(value);
    //     }
    //     console.log(viewFeedBackList, 'viewFeedBackList');
    //     this.setState({
    //         viewFeedBackList,
    //     });
    //   });
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

  render() {
    const {viewFeedBackList,feedBackKey} = this.state
    console.log("feedBackKey",feedBackKey)
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
                FeedBack Users List
              </Text>
            </View>
            <View style={styles.container1}>
              <FlatList
                style={styles.list}
                data={viewFeedBackList}
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
                        <View
                          style={styles.flatListEmailTimeView}>
                          <View>
                            <Text
                              style={styles.flatListEmailText}>
                              {item.email}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={styles.flatListTimeText}>
                              {item.time}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={styles.flatListVehicleName}>
                          {item.vehicleName}
                        </Text>
                        <Text
                          style={styles.flatListVehicleType}>
                          {item.vehicleType}
                        </Text>
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
  container1TextHeader:{
    fontSize:28,
    fontWeight:'bold',
    alignSelf:'center',
    marginHorizontal:90
  },
  //container1 View
  container1: {
    height: hp('75%'),
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
  flatListEmailText: {
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 18,
  },
  flatListTimeText: {
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 18,
  },
  flatListVehicleName: {
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 18,
  },
  flatListVehicleType: {
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 18,
  },
  //container2 View
  container2: {
    marginTop: 'auto',
    alignItems:'center',
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
    justifyContent:'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
  },
  //container3 View
  container3: {
    height: hp('72%'),
    // backgroundColor:'blue',
  },
  textContainer3:{
    marginHorizontal:10,
    marginVertical:10,
    fontSize:18,
    fontWeight:'bold',
    color:'white'
  },
  textInputContainer3:{
    marginHorizontal:10,
    width: wp('96%'),
    borderWidth:2,
    borderColor:'#67bae3',
    paddingHorizontal:10,
    color:'white',
  },
});