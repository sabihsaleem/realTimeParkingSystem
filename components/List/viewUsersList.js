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

export default class viewUsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      viewUsersListNonAdmin: [],
    };
  }

  componentDidMount = () => {
    const user = auth().currentUser;

    firebase
      .database()
      .ref('User')
      .on('value', (snapshot) => {
        const getValue = snapshot.val();

        let viewUsersList = [];
        for (let key in getValue) {
          const value = {...getValue[key], key};
          viewUsersList.push(value);
        }

        const viewUsersListNonAdmin = viewUsersList.filter(
          (el) => el.isAdmin === false,
        );

        this.setState({
          viewUsersListNonAdmin,
        });
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

  feeddbackList (index, item) {
    this.props.navigation.navigate('viewFeedBackList', {
      item,
    });
  }

  delete (index, item) {
    let deleted = 'User/' + item.key;
    console.log('delete', deleted);
    firebase.database().ref(deleted).remove();
  }

  render() {
    const {viewUsersListNonAdmin} = this.state;

    return (
      <View style={styles.main}>
        {this.state.isLoading ? (
          <ScrollView>
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
              <Text style={styles.containerTextHeader}>Users List</Text>
            </View>
            <View style={styles.container1}>
              <FlatList
                style={styles.list}
                data={viewUsersListNonAdmin}
                ListEmptyComponent={() => this.emptyComponent()}
                renderItem={({item, index}) => (
                  <View style={styles.container1FlatlistView}>
                    <View style={{marginVertical: 5}}>
                      <View style={{justifyContent: 'space-between'}}>
                        <Text style={styles.flatListNameText}>
                          {item.name.toUpperCase()}
                        </Text>
                        <View style={styles.flatListEmailContactNoView}>
                          <View>
                            <Text style={styles.flatListText}>
                              {item.email}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.flatListText}>
                              {item.contactNo}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.flatListText}>{item.address}</Text>
                      </View>
                      <View style={styles.flatListContainer}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => this.feeddbackList(index, item)}>
                          <Text style={styles.buttonText}>Feedback List</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.flatListContainer}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => this.delete(index, item)}>
                          <Text style={styles.buttonText}>Delete</Text>
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
    backgroundColor: '#f98b34',
  },
  //container View
  container: {
    borderWidth: 1,
    flexDirection: 'row',
  },
  image: {
    marginVertical: 5,
    width: wp('10%'),
    height: hp('6.5%'),
    marginHorizontal: 5,
  },
  containerTextHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginHorizontal: 90,
  },
  container1TextHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginHorizontal: 90,
  },
  //container1 View
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
    backgroundColor: '#f39c12',
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
