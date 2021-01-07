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

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      address: '',
      contactNo: '',
      isLoading: true,
      currentUser:[],
      currentUserKey:'',
    };
  }
  componentDidMount = () => {
    const user = auth().currentUser;
    console.log('user', user);
    firebase
      .database()
      .ref('User')
      .on('value', (snapshot) => {
        console.log("Profilesnapshot.val()", snapshot.val())
        const getValue = snapshot.val();
        console.log("ProfilegetValue", getValue)
        let array = [];
        for (let key in getValue) {
          // console.log("key", key)
          const value = {...getValue[key], key};
          array.push(value);
        }
        console.log(array, 'Profilearray');
        const currentUser = array.filter(
          (el) => el.email.toLowerCase() === user.email.toLowerCase(),
        );
        console.log('currentUserProfile', currentUser);
        this.setState({
          currentUser,
          currentUserKey:currentUser[0].key,
          email:currentUser[0].email,
          name:currentUser[0].name,
          address:currentUser[0].address,
          contactNo:currentUser[0].contactNo,
        });
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

  edit = () => {
    this.setState({
      isLoading: false,
    });
  };

  back = () => {
    this.setState({
      isLoading: true,
    });
  };

  onUpdate(name, address, contactNo) {
    console.log('User/',this.state.currentUserKey);
    firebase
      .database()
      .ref('User/' + this.state.currentUserKey)
      .update({
        name,
        address,
        contactNo,
      })
      .then(() => {
        this.setState({
          isLoading: true,
        });
        console.log('Data update.');
        alert('Data update.');
      })
      .catch((error) => {
        console.log('failed: ' + error.message);
      });
  }

  render() {
    const {currentUser,name,email,address,contactNo} = this.state
    console.log("email",email,name,contactNo,address)
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
                Profile
              </Text>
            </View>
            <View style={styles.container1}>
              <FlatList
                style={styles.list}
                data={currentUser}
                ListEmptyComponent={() => this.emptyComponent()}
                renderItem={({item, index}) => (
                  <View
                    style={styles.container1FlatlistView}>
                    <View style={{marginVertical: 5}}>
                    
                      <View style={{justifyContent: 'space-between'}}>
                        <Text
                          style={styles.flatListNameText}>
                          {item.name.toUpperCase()}
                        </Text>
                        <View
                          style={styles.flatListEmailContactNoView}>
                          <View>
                            <Text
                              style={styles.flatListEmailText}>
                              {item.email}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={styles.flatListContactNoText}>
                              {item.contactNo}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={styles.flatListAddress}>
                          {item.address}
                        </Text>
                      </View>

                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => `${index}`}
              />
            </View>
            <View style={styles.container2}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.edit()}
              >
                <Text
                  style={styles.buttonText}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <KeyboardAwareScrollView>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {
                // this.props.navigation.goBack();
                  this.back();
                }}
                >
                  <Image
                    style={styles.image}
                    source={require('../../back-button-icon-png-25.jpg')}
                  />
              </TouchableOpacity>
              <Text style={styles.container1TextHeader}>
                Edit Profile
              </Text>
            </View>
            <View style={styles.container3}>
              <Text style={styles.textContainer3}>Name:</Text>
              <TextInput
                  style={styles.textInputContainer3}
                  placeholder={name}
                  placeholderTextColor= "white"
                  value={name}
                  onChangeText={(name) =>
                      this.setState({name: name})
                  }
              />
              <Text style={styles.textContainer3}>Email:</Text>
              <TextInput
                  style={styles.textInputContainer3}
                  placeholder={email}
                  placeholderTextColor= "white"
                  editable={false}
              />
              <Text style={styles.textContainer3}>Address:</Text>
              <TextInput
                  style={styles.textInputContainer3}
                  placeholder={address}
                  placeholderTextColor= "white"
                  value={address}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(address) =>
                      this.setState({address: address})
                  }
              />
              <Text style={styles.textContainer3}>Contact No:</Text>
              <TextInput
                  style={styles.textInputContainer3}
                  placeholder={contactNo}
                  placeholderTextColor= "white"
                  maxLength={14}
                  value={contactNo}
                  onChangeText={(contactNo) =>
                      this.setState({contactNo: contactNo})
                  }
              />   
            </View>
            <View style={{alignItems:'center',marginVertical:10}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onUpdate(name, address, contactNo)}
              >
                <Text
                  style={styles.buttonText}
                >
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
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
    marginHorizontal:110
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
  flatListEmailContactNoView: {
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
  flatListContactNoText: {
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 18,
  },
  flatListAddress: {
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