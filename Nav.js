import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button } from 'react-native';
import Home from './components/Home';
import Login from './components/Login';
import Registeration from './components/Registeration';
import Admin from './components/Dashboard/Admin';
import Profile from './components/Profile/Profile';
import User from './components/Dashboard/User';
import AddBooking from './components/booking/AddBooking';
import FeedBack from './components/FeedBack/FeedBack';
import viewUsersList from './components/List/viewUsersList';
import viewBookedUsersList from './components/List/viewBookedUsersList';
import viewFeedBackList from './components/List/viewFeedBackList';
import Location from './components/Location/Location';
import viewLocation from './components/List/viewLocation';
import addSlots from './components/Location/addSlots';
import viewSlots from './components/List/viewSlots';
import checkLocation from './components/Location/checkLocation';
import viewSlotsList from './components/List/viewSlotsLists';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registeration" component={Registeration} />
            <Stack.Screen name="Admin" component={Admin} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="User" component={User} />
            <Stack.Screen name="ADDBooking" component={AddBooking} />
            <Stack.Screen name="FeedBack" component={FeedBack} />
            <Stack.Screen name="viewUsersList" component={viewUsersList} />
            <Stack.Screen name="viewBookedUsersList" component={viewBookedUsersList} />
            <Stack.Screen name="viewFeedBackList" component={viewFeedBackList} />
            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="LocationView" component={viewLocation} />
            <Stack.Screen name="ADDSlots" component={addSlots} />
            <Stack.Screen name="ViewSlots" component={viewSlots} />
            <Stack.Screen name="checkLocation" component={checkLocation} />
            <Stack.Screen name="SlotsList" component={viewSlotsList} />
        </Stack.Navigator>
    );
}