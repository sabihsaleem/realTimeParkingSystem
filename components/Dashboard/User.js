import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        name: '',
        bookingKey: null,
        feedbackKey: null,
        keyCurrentUser: '',
        currentUser: []
    };
  }

  componentDidMount () {
    const user = auth().currentUser;
    AsyncStorage.getItem('@User').then((
      value => {
      console.log(JSON.parse(value))
      let d = JSON.parse(value)
      let name = [] 
      for (const element in d) {
          value={...d[element],element}
          name.push(
              value
          )
      }
      console.log("name",name[0].key)
      this.setState({name:name[0].name,keyCurrentUser:name[0].key})
    }))
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
        
        var feedbackValue = currentUser && currentUser[0]?.FeedBack
        
        var bookingValue = currentUser && currentUser[0]?.Booking

        if( feedbackValue===undefined ) {
        }else {
          let feedbackData = []
          for( let feedbackKey in feedbackValue ) {
              const value = {...feedbackValue[feedbackKey],feedbackKey}
              feedbackData.push(value)
          }

          this.setState({
              feedbackKey: feedbackData && feedbackData[0]?.feedbackKey,
          });
        
        };
          if( bookingValue===undefined ) {
          }else {
            let bookingData = []
            for ( let bookingKey in bookingValue ){
              const value = {...bookingValue[bookingKey],bookingKey}
              bookingData.push(value)
            }
  
            this.setState({
                bookingKey: bookingData && bookingData[0]?.bookingKey,
            });
  
          };
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

        let dateCurrent = new Date();
        dateCurrent.getTime()
        dateCurrent.setSeconds(0);
        dateCurrent.setMilliseconds(0);
        for( let keydata of arrayLocation ){

          if( keydata.Slots ){
            let slots = keydata.Slots

            for( let keydataSlots in slots ){

              if( slots[keydataSlots].bookedUsers ){
                let bookedUsers = slots[keydataSlots].bookedUsers

                for ( let key in bookedUsers ) {
                  let date = new Date(bookedUsers[key].startTimeStamp);
                  let condition = 
                                  dateCurrent.getTime()>=bookedUsers[key].endTimeStamp
                                  &&
                                  dateCurrent.getFullYear()===date.getFullYear()
                                  &&
                                  dateCurrent.getMonth()===date.getMonth()
                                  &&
                                  dateCurrent.getDate()===date.getDate()
                                  &&
                                  key===bookedUsers[key].UserKey
                  if ( condition ) {

                    let deleted = 'Location/'+keydata.keyLocation+'/Slots/'+keydataSlots+'/bookedUsers/'+key

                    firebase.database().ref(deleted).remove();
                    let deletes = 'User/'+this.state.keyCurrentUser+'/Booking/'+this.state.bookingKey

                    firebase.database().ref(deleted).remove();

                  }else {
                    console.log('false')
                  }
                }
              }
            }
          }
        }
      });
  }

  locationView () {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('checkLocation');
  }

  profile () {
    this.setState = {
      isLoading: false,
    };
    this.props.navigation.navigate('Profile');
  }

  signOut () {
    auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Home');
        AsyncStorage.removeItem('@User');
      });
  }

  feedBack () {
    { this.state.feedbackKey ? false : this.props.navigation.navigate('FeedBack') }
  }

  render() {
    const {name,feedbackKey,bookingKey,keyCurrentUser} = this.state

    return (
      <View style={styles.image}>
        {this.state.isLoading ? (
          <View>
            <View style={styles.container}>
              <Text style={styles.textHeader}>
                {' '}
                {name}{' '}
              </Text>
            </View>

            <View style={styles.container1}>
              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.profile()}>
                  <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  disabled={feedbackKey}
                  onPress={() => this.feedBack()}>
                  <Text style={styles.buttonText}>{ feedbackKey ? "FeedBack Already" : "FeedBack"}</Text>
                </TouchableOpacity>
              </View>

              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.locationView()}>
                  <Text style={styles.buttonText}>View Location Areas </Text>
                </TouchableOpacity>
              </View>

              <View style={{marginTop: 'auto'}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.signOut()}>
                  <Text style={styles.buttonText}>Sign out</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  image: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    backgroundColor: '#f98b34',
  },
  //container View
  container: {
    alignItems: 'center',
    height: 100,
  },
  textHeader: {
    marginVertical: 50,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
  },
  //container1 View
  container1: {
    height: 490,
    marginVertical: 60,
    width: wp('95%'),
  },
  text: {
    marginVertical: 7,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#f39c12',
    borderRadius: 10,
    borderWidth: 2,
    width: wp('95%'),
    height: 60,
    marginHorizontal: 10,
    borderColor: '#67bae3',
  },
  buttonText: {
    marginVertical: 11,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
    alignSelf: 'center',
  },
});
