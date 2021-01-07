import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount(){
        console.log("this.props", this.props)
        AsyncStorage.getItem('@User').then((
          value => {
          console.log(JSON.parse(value))
          let d = JSON.parse(value)
          let data=[] 
          for (const element in d) {
              // console.log(element);
              value={...d[element],element}
              data.push(
                  value
              )
          }
          console.log("data",data)
          if(value === null){
            // this.props
            console.log("null")
            this.props.navigation.navigate('Home')
            
          }else {

            if(data[0].isAdmin===true){
              //redirect to admin
              console.log("Admin")
              this.props.navigation.navigate('Admin')
            }
            else{
              //redirect to User
              console.log("User")
              this.props.navigation.navigate('User')
            }
            
          }
        }))
    
    }

    login(){
        this.props.navigation.navigate("Login")
    }

    registeration(){
        this.props.navigation.navigate("Registeration")
    }

    render(){
        return(
            <View style={styles.main}>
                <View style={styles.container1}>
                    <Text style={styles.textHeader}>Welcome</Text>
                </View>
                <View style={styles.container2}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={()=> this.login()}
                        >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={()=> this.registeration()}
                        >
                        <Text style={styles.buttonText}>Registeration</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        resizeMode: 'cover',
        width: wp('100%'),
        backgroundColor:'#f98b34'
    },
    // container
    container1: {
        height: hp('30%'),
        alignItems:'center',
        justifyContent:'center',
        // backgroundColor:'red'
    },
    textHeader: {
        fontSize: 36,
        fontWeight:'bold',
    },
    container2: {
        height: hp('70%'),
        // backgroundColor:'blue',
        alignItems:'center',
        
        marginVertical:80,
        // justifyContent:'center',
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
        fontSize: 26,
        fontWeight:'bold',
        color:'white',
    }
});