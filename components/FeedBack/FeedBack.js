import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

let config = {
    appId: '1:760692111499:android:cbe6dde0892631f7debc8e',
    apiKey: 'AIzaSyAeHo_npJGSLNSOtLfibdZpYKtkB5NqXTI',
    authDomain: '760692111499-88l985a4au0v94t3lg6sd8vbstor5d0f.apps.googleusercontent.com',
    databaseURL: 'https://realtimeparkingbookingsystem-default-rtdb.firebaseio.com/',
    projectId: 'realtimeparkingbookingsystem',
    storageBucket: 'realtimeparkingbookingsystem.appspot.com',
    messagingSenderId: '',
    project_number: "760692111499",
  };
let app;
if (firebase.apps.length === 0) {
app = firebase.initializeApp(config);
}

export default class FeedBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      isLoading: true,
      Experience: null,
      review: null,
      key:'',
      city:'',
      country:'',
      comments:'',
    };
  }

  review(item) {
    console.log("item",item.label,item,item.value)
    this.setState({
        review:item.label,
    });
  }

  rateYourExperience(item) {
    console.log("rateYourExperienceItem",item.label,item,item.value)
    this.setState({
        Experience:item.label,
    });
  }

  componentDidMount(){
    const user = auth().currentUser;
    console.log('user', user);
    firebase
      .database()
      .ref('User')
      .on('value', (snapshot) => {
        console.log("snapshot.val()", snapshot.val())
        const getValue = snapshot.val();
        console.log("getValue", getValue)
        let array = [];
        for (let key in getValue) {
          // console.log("key", key)
          const value = {...getValue[key], key};
          array.push(value);
        }
        console.log(array, 'array');
        const currentUser = array.filter(
          (el) => el.email.toLowerCase() === user.email.toLowerCase(),
        );
        console.log('currentUser[0].name', currentUser);
        this.setState({
          name: currentUser[0].name,
          email: currentUser[0].email,
          key:currentUser[0].key,
        });
      });
  }

  onAddBooking(key, name, email, city, country, Experience, review, comments){
    console.log("this.state.review",this.state.review)
    console.log("this.state.rateYourExperience",this.state.Experience)
    firebase
    .database()
    .ref('User/'+this.state.key+'/FeedBack')
    .push({
        UserKey: key,
        name,
        email,
        city,
        country,
        Experience,
        review,
        comments,
    })
    .then(() => {
        console.log('Data update.');
        alert('Data update.');
        this.props.navigation.navigate('User');
    })
    .catch((error) => {
        console.log('failed: ' + error.message);
    });
  }

  render() {
    const {key, name, email, city, country, Experience, review, comments} = this.state
    console.log("review",review)
    return (
        <View style={styles.main}>
        {this.state.isLoading ?
            <KeyboardAwareScrollView>
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
                    <Text style={styles.textContainer}>Add FeedBack</Text>
                </View>
                <View style={styles.container2}>
                    <Text style={styles.textContainer2}>Name:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder={name}
                        placeholderTextColor= "white"
                        editable={false}
                    />
                    <Text style={styles.textContainer2}>Email:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder={email}
                        placeholderTextColor= "white"
                        editable={false}
                    />
                    <Text style={styles.textContainer2}>City:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder="Enter Here"
                        placeholderTextColor= "white"
                        value={city}
                        onChangeText={(city) =>
                            this.setState({city: city})
                        }
                    />
                    <Text style={styles.textContainer2}>Country:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder="Enter Here"
                        placeholderTextColor= "white"
                        value={country}
                        onChangeText={(country) =>
                            this.setState({country: country})
                        }
                    />
                    <Text style={styles.textContainer2}>Rate Your Experience:</Text>
                    <DropDownPicker
                        items={[
                            {label: 'Good', value: '0'},
                            {label: 'Best', value: '1'},
                            {label: 'Better', value: '2'},
                            {label: 'Fair', value: '3'},
                            {label: 'Worst', value: '4'},
                            {label: 'Bad', value: '5'},
                        ]}
                        defaultNull
                        placeholder="Rate Your Experience"
                        containerStyle={{height: hp('8%'),width: wp('96%'),alignSelf:'center'}}
                        onChangeItem={item => this.rateYourExperience(item)}
                    />
                    <Text style={styles.textContainer2}> How did you here about us</Text>
                    <DropDownPicker
                        items={[
                            {label: 'TV', value: '0'},
                            {label: 'Newspaper', value: '1'},
                            {label: 'Freinds', value: '2'},
                            {label: 'Internet', value: '3'},
                            {label: 'BillBoard', value: '4'},
                            {label: 'Social Media', value: '5'},
                            {label: 'Other', value: '6'},
                        ]}
                        defaultNull
                        placeholder="Select"
                        containerStyle={{height: hp('8%'),width: wp('96%'),alignSelf:'center'}}
                        onChangeItem={item => this.review(item)}
                    />
                    <Text style={styles.textContainer2}>Comments:</Text>
                    <TextInput
                        style={styles.textInputContainer2}
                        placeholder="Enter Here"
                        placeholderTextColor= "white"
                        value={comments}
                        multiline={true}
                        numberOfLines={4}
                        maxLength={50}
                        onChangeText={(comments) =>
                            this.setState({comments: comments})
                        }
                    />
                </View>
                <View style={styles.container3}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.onAddBooking(key, name, email, city, country, Experience, review, comments)}
                    >
                        <Text style={styles.buttonText}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
            :
            <View>
                <Text> Failed </Text>
            </View>
        }
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
    //container
    container: {
        borderWidth:1,
        flexDirection:'row',
        alignItems:'center',
    },
    image: {
        marginVertical: 5,
        width: wp('10%'),
        height: hp("6.5%"),
        marginHorizontal: 5,
    },
    textContainer:{
        marginHorizontal:60,
        fontSize:28,
        fontWeight:'bold',
    },
    //container2
    container2: {
        // backgroundColor:'blue',
    },
    textContainer2:{
        marginHorizontal:10,
        marginVertical:10,
        fontSize:18,
        fontWeight:'bold',
        color:'white'
    },
    textInputContainer2:{
        marginHorizontal:10,
        width: wp('96%'),
        borderWidth:2,
        borderColor:'#67bae3',
        paddingHorizontal:10
    },
    //conatainer3
    container3:{
        height: hp('15%'),
        // backgroundColor:'green',
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
