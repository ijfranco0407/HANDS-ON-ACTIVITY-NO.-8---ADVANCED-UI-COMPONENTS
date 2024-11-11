import React, { useState, useEffect } from 'react';
import { View, Text, Button, Animated, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedReanimated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

AnimatedReanimated.addWhitelistedNativeProps({});

const withLogging = (WrappedComponent) => {
  return (props) => {
    const logAction = (action) => {
      console.log('Action:', action);
    };

    return <WrappedComponent {...props} logAction={logAction} />;
  };
};

const CustomButton = withLogging(({ logAction, onPress }) => {
  const handlePress = () => {
    logAction('Button pressed');
    onPress();
  };

  return <Button title="Press Me" onPress={handlePress} />;
});

const FadingView = () => {
  const [fadeAnim] = useState(new Animated.Value(0)); 
  const [isVisible, setIsVisible] = useState(true); 

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1, 
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0, 
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const toggleFade = () => {
    if (isVisible) {
      fadeOut();
    } else {
      fadeIn();
    }
    setIsVisible(!isVisible); 
  };

  useEffect(() => {
    fadeIn(); 
  }, []);

  return (
    <View>
      <Animated.View style={{ ...styles.fadingContainer, opacity: fadeAnim }}>
        <Text style={styles.fadingText}>I am fading in and out</Text>
      </Animated.View>
      <Button title={isVisible ? "Fade Out" : "Fade In"} onPress={toggleFade} />
    </View>
  );
};


const ReanimatedTransition = () => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const moveBox = () => {
    translateX.value = withSpring(Math.random() * 200 - 100); 
  };

  return (
    <View style={styles.transitionContainer}>
      <AnimatedReanimated.View style={[styles.box, animatedStyle]} />
      <Button title="Move Box" onPress={moveBox} />
    </View>
  );
};


export default function App() {
  const handleButtonPress = () => {
    console.log('Custom button pressed!');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>React Native application</Text>
        <CustomButton onPress={handleButtonPress} />
        <FadingView />
        <ReanimatedTransition />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fadingContainer: {
    padding: 20,
    backgroundColor: 'powderblue',
    marginVertical: 20,
  },
  fadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
  transitionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'skyblue',
    marginBottom: 20,
  },
});
