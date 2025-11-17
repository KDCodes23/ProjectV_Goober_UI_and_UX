import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from './screens/Splash';
import Welcome from './screens/Welcome';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import EnterName from './screens/EnterName';
import EnterContact from './screens/EnterContact';
import EnterEmail from './screens/EnterEmail';
import EmailVerification from './screens/EmailVerification';
import CreatePassword from './screens/CreatePassword';
import SelectLocation from './screens/SelectLocation';
import SelectDate from './screens/SelectDate';
import SelectTime from './screens/SelectTime';
import SelectSeats from './screens/SelectSeats';
import BookRide from './screens/BookRide';
import AvailableRides from './screens/AvailableRides';
import TripDetails from './screens/TripDetails';
import TripGoldenRules from './screens/TripGoldenRules';
import BookingConfirmed from './screens/BookingConfirmed';
import LookingForRides from './screens/LookingForRides';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="EnterName" component={EnterName} />
        <Stack.Screen name="EnterContact" component={EnterContact} />
        <Stack.Screen name="EnterEmail" component={EnterEmail} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="CreatePassword" component={CreatePassword} />
        <Stack.Screen name="SelectLocation" component={SelectLocation} />
        <Stack.Screen name="SelectDate" component={SelectDate} />
        <Stack.Screen name="SelectTime" component={SelectTime} />
        <Stack.Screen name="SelectSeats" component={SelectSeats} />
        <Stack.Screen name="BookRide" component={BookRide} />
        <Stack.Screen name="AvailableRides" component={AvailableRides} />
        <Stack.Screen name="TripDetails" component={TripDetails} />
        <Stack.Screen name="TripGoldenRules" component={TripGoldenRules} />
        <Stack.Screen name="BookingConfirmed" component={BookingConfirmed} />
        <Stack.Screen name="LookingForRides" component={LookingForRides} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
