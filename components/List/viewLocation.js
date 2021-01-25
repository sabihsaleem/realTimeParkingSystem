import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class viewLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      viewLocationData: [],
    };
  }

  componentDidMount = () => {
    firebase
      .database()
      .ref('Location')
      .on('value', (snapshot) => {

        const getValue = snapshot.val();

        let viewLocationData = [];
        for (let key in getValue) {
          const value = {...getValue[key], key};
          viewLocationData.unshift(value);
        }

        this.setState({
          viewLocationData,
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

  addSlots (index, item) {
    this.props.navigation.navigate('ADDSlots', {
      item,
    });
  }

  viewSlots (index, item) {
    this.props.navigation.navigate('SlotsList', {
      item,
    });
  }

  delete (index, item) {
    let deleted = 'Location/' + item.key;
    console.log('delete', deleted);
    firebase.database().ref(deleted).remove();
  }

  render() {
    const {viewLocationData, userKey} = this.state;
    return (
      <View style={styles.main}>
        {this.state.isLoading ? (
          <>
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
              <Text style={styles.containerTextHeader}>
                Location Areas List
              </Text>
            </View>
            <ScrollView>
              <View style={styles.container1}>
                <FlatList
                  style={styles.list}
                  data={viewLocationData}
                  ListEmptyComponent={() => this.emptyComponent()}
                  renderItem={({item, index}) => (
                    <View style={styles.container1FlatlistView}>
                      <View style={{marginVertical: 5}}>
                        <View style={{justifyContent: 'space-between'}}>
                          <Text style={styles.flatListNameText}>
                            {item.locationName.toUpperCase()}
                          </Text>
                          <View style={styles.flatListEmailContactNoView}>
                            <View>
                              <Text style={styles.flatListText}>
                                {item.locationDetails}
                              </Text>
                            </View>
                            <View>
                              <Text style={styles.flatListText}>
                                {item.noFSlots}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.flatListText}>
                            {item.locationAddress}
                          </Text>
                          <Text style={styles.flatListText}>
                            {item.locationContactNo}
                          </Text>
                        </View>
                        <View style={styles.flatListContainer}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.addSlots(index, item)}>
                            <Text style={styles.buttonText}>Add Slots</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.flatListContainer}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.viewSlots(index, item)}>
                            <Text style={styles.buttonText}>View Slots</Text>
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
          </>
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
    marginHorizontal: 50,
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
