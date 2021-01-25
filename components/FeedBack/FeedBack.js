import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';

export default class FeedBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      isLoading: true,
      Experience: null,
      review: null,
      key: '',
      city: '',
      country: '',
      comments: '',
    };
  }

  review ( item ) {
    this.setState({
      review: item.label,
    });
  }

  rateYourExperience ( item ) {
    this.setState({
      Experience: item.label,
    });
  }

  componentDidMount () {
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

        this.setState({
          name: currentUser[0].name,
          email: currentUser[0].email,
          key: currentUser[0].key,
        });

      });
  }

  onFeedBack (
      key,
      name, 
      email, 
      city, 
      country, 
      Experience,
      review, 
      comments
  ) {
    if(
      this.state.city &&
      this.state.country &&
      this.state.Experience &&
      this.state.review &&
      this.state.comments
    ){
      
      firebase
        .database()
        .ref('User/' + this.state.key + '/FeedBack')
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
    else{
      alert('Enter Data Please');
    }
  }

  render() {
    const {
      key,
      name,
      email,
      city,
      country,
      Experience,
      review,
      comments,
    } = this.state;
    return (
      <View style={styles.main}>
        {this.state.isLoading ? (
          <KeyboardAwareScrollView>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
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
                placeholderTextColor="white"
                editable={false}
              />
              <Text style={styles.textContainer2}>Email:</Text>
              <TextInput
                style={styles.textInputContainer2}
                placeholder={email}
                placeholderTextColor="white"
                editable={false}
              />
              <Text style={styles.textContainer2}>City:</Text>
              <TextInput
                style={styles.textInputContainer2}
                placeholder="Enter Here"
                placeholderTextColor="white"
                value={city}
                onChangeText={(city) => this.setState({city: city})}
              />
              <Text style={styles.textContainer2}>Country:</Text>
              <TextInput
                style={styles.textInputContainer2}
                placeholder="Enter Here"
                placeholderTextColor="white"
                value={country}
                onChangeText={(country) => this.setState({country: country})}
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
                containerStyle={{
                  height: hp('8%'),
                  width: wp('96%'),
                  alignSelf: 'center',
                }}
                style={{ backgroundColor: '#f98b34',borderColor: '#67bae3',borderWidth:2, }}
                itemStyle={{ justifyContent: 'flex-start', }}
                dropDownStyle={{ backgroundColor: '#f17b30', color: 'white' }}
                labelStyle={{ textAlign: 'left',color: 'white' }}
                placeholderStyle={{ color: 'white' }}
                onChangeItem={(item) => this.rateYourExperience(item)}
              />
              <Text style={styles.textContainer2}>
                {' '}
                How did you here about us
              </Text>
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
                containerStyle={{
                  height: hp('8%'),
                  width: wp('96%'),
                  alignSelf: 'center',
                }}
                style={{ backgroundColor: '#f98b34',borderColor: '#67bae3',borderWidth:2, }}
                itemStyle={{ justifyContent: 'flex-start', }}
                dropDownStyle={{ backgroundColor: '#f17b30', color: 'white' }}
                labelStyle={{ textAlign: 'left',color: 'white' }}
                placeholderStyle={{ color: 'white' }}s
                onChangeItem={(item) => this.review(item)}
              />
              <Text style={styles.textContainer2}>Comments:</Text>
              <TextInput
                style={styles.textInputContainer2}
                placeholder="Enter Here"
                placeholderTextColor="white"
                value={comments}
                multiline={true}
                numberOfLines={4}
                maxLength={50}
                onChangeText={(comments) => this.setState({comments: comments})}
              />
            </View>
            <View style={styles.container3}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  this.onFeedBack(
                    key,
                    name,
                    email,
                    city,
                    country,
                    Experience,
                    review,
                    comments,
                  )
                }>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        ) : (
          <View>
            <Text> Failed </Text>
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
    backgroundColor: '#f98b34',
  },
  //container
  container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginVertical: 5,
    width: wp('10%'),
    height: hp('6.5%'),
    marginHorizontal: 5,
  },
  textContainer: {
    marginHorizontal: 60,
    fontSize: 28,
    fontWeight: 'bold',
  },
  //container2
  textContainer2: {
    marginHorizontal: 10,
    marginVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  textInputContainer2: {
    marginHorizontal: 10,
    width: wp('96%'),
    borderWidth: 2,
    borderColor: '#67bae3',
    paddingHorizontal: 10,
    color: 'white',
  },
  //conatainer3
  container3: {
    height: hp('15%'),
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#67bae3',
    backgroundColor: '#f39c12',
    width: wp('96%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginVertical: 11,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
    alignSelf: 'center',
  },
});
