// Ignore specific warnings (optional - helps with development)
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { registerRootComponent } from 'expo';

import { UserProvider } from './contexts/UserContext';
import { RideProvider } from './contexts/RideContext';
import { RegistrationProvider } from './contexts/RegistrationContext';

// Auth screens
import Splash from './screens/auth/Splash';
import Welcome from './screens/auth/Welcome';
import SignIn from './screens/auth/SignIn';
import SignUp from './screens/auth/SignUp';
import TwoFactorAuth from './screens/auth/TwoFactorAuth';

// Registration screens
import EnterName from './screens/auth/registration/EnterName';
import EnterContact from './screens/auth/registration/EnterContact';
import EnterEmail from './screens/auth/registration/EnterEmail';
import EmailVerification from './screens/auth/registration/EmailVerification';
import CreatePassword from './screens/auth/registration/CreatePassword';

// Main screens
import Home from './screens/Home';

// Booking screens
import SelectLocation from './screens/booking/SelectLocation';
import SelectDate from './screens/booking/SelectDate';
import SelectTime from './screens/booking/SelectTime';
import SelectSeats from './screens/booking/SelectSeats';
import BookRide from './screens/booking/BookRide';
import AvailableRides from './screens/booking/AvailableRides';
import TripDetails from './screens/booking/TripDetails';
import TripGoldenRules from './screens/booking/TripGoldenRules';
import BookingConfirmed from './screens/booking/BookingConfirmed';
import LookingForRides from './screens/booking/LookingForRides';
import OtherPassengers from './screens/booking/OtherPassengers';

// Ride screens
import BookingAccepted from './screens/ride/BookingAccepted';
import DriverEnRoute from './screens/ride/DriverEnRoute';
import DriverArrived from './screens/ride/DriverArrived';
import InTripMap from './screens/ride/InTripMap';
import RideCompleted from './screens/ride/RideCompleted';
import RideRating from './screens/ride/RideRating';
import LeaveComment from './screens/ride/LeaveComment';

// Profile screens
import Profile from './screens/profile/Profile';
import Payment from './screens/profile/Payment';

// Trips screen
import Trips from './screens/Trips';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <Text style={styles.errorDetails}>{this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  console.log('📱 App component rendering...');
  
  return (
    <ErrorBoundary>
      <UserProvider>
        <RideProvider>
          <RegistrationProvider>
            <NavigationContainer
              onReady={() => console.log('✅ Navigation ready')}
              onStateChange={() => console.log('📍 Navigation state changed')}
            >
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
                <Stack.Screen name="OtherPassengers" component={OtherPassengers} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Payment" component={Payment} />
                <Stack.Screen name="RideRating" component={RideRating} />
                <Stack.Screen name="LeaveComment" component={LeaveComment} />
                <Stack.Screen name="RideCompleted" component={RideCompleted} />
                <Stack.Screen name="BookingAccepted" component={BookingAccepted} />
                <Stack.Screen name="DriverEnRoute" component={DriverEnRoute} />
                <Stack.Screen name="DriverArrived" component={DriverArrived} />
                <Stack.Screen name="InTripMap" component={InTripMap} />
                <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuth} />
                <Stack.Screen name="Trips" component={Trips} />
              </Stack.Navigator>
            </NavigationContainer>
          </RegistrationProvider>
        </RideProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

// Register this component as the root component
// This is the entry point for the Expo app
console.log('🚀 Starting Goober App...');
registerRootComponent(App);
