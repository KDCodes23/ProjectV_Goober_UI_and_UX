import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Platform } from 'react-native';
import { Image } from 'expo-image';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

// Animated cloud puff component
function AnimatedExhaustPuff() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [anim]);

  // Cloud animates outward and fades
  const cloudTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70], // Outward (to the right)
  });
  const cloudOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });
  const cloudScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          left: 105, top: 62, // Position at exhaust of car image
          opacity: cloudOpacity,
          transform: [
            { translateX: cloudTranslate },
            { scale: cloudScale }
          ],
        }
      ]}
    />
  );
}

// Main loading component with car and animated exhaust
function CenteredCarLoading() {
  return (
    <ThemedView style={styles.loadingContainer}>
      {/* Goo car centered */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('@/assets/images/goo_car.png')}
          style={styles.car}
        />
        {/* Multiple puffs for effect, spaced by delays or offsets */}
        <AnimatedExhaustPuff />
        {/* To layer extra clouds, add more AnimatedExhaustPuff with delay logic if desired */}
      </View>
      <ThemedText type="title">Loading...</ThemedText>
    </ThemedView>
  );
}

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async loading, replace with your own logic
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CenteredCarLoading />;
  }

  // Rest of your home screen
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFBC25', dark: '#000000ff' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFBC25',
    justifyContent: 'center',
    alignItems: 'center',
  },
  car: {
    width: 180,
    height: 90,
    alignSelf: 'center',
  },
  cloud: {
    width: 44,
    height: 22,
    borderRadius: 40,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
