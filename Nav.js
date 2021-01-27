import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
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
import AdminProfile from './components/Profile/AdminProfile';
import Facebook from './components/Dashboard/Facebook';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
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
            <Stack.Screen name="AdminProfile" component={AdminProfile} />
            <Stack.Screen name="Facebook" component={Facebook} />
        </Stack.Navigator>
    );
}