import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("screen");
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const EXTRA_SCALE = 1.3; // 🔑 clé du problème

export default function AnimatedBackground() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.15, width * 0.15],
  });

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.15, height * 0.15],
  });

  return (
    <AnimatedLinearGradient
      colors={["#020617", "#0e1a39ff", "#4338CA", "#302c99ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradient,
        {
          transform: [{ translateX }, { translateY }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    width: width * EXTRA_SCALE,
    height: height * EXTRA_SCALE,
    top: -(height * (EXTRA_SCALE - 1)) / 2,
    left: -(width * (EXTRA_SCALE - 1)) / 2,
  },
});
