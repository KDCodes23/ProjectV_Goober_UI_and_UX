// /screens/Splash.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SplashScreenProps } from '../types/navigation';

export default function Splash({ navigation }: SplashScreenProps) {
  useEffect(() => {
    // Navigate to Welcome screen after a short delay
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/Icon_Goober.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Goober</Text>
      <Text style={styles.subtitle}>Your friendly ride-buddy</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
});

