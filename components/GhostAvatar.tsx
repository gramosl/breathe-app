import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    withSequence,
    Easing, 
    interpolateColor,
    interpolate
} from 'react-native-reanimated';

interface GhostProps {
    level: number; // 1 = Glitch, 2 = Solid, 3 = Vibrant
    mood: number; // 0 to 1 (Numb -> Vibrant)
}

export default function GhostAvatar({ level, mood }: GhostProps) {
    const float = useSharedValue(0);
    const glitch = useSharedValue(0);
    const breath = useSharedValue(0);

    // 1. Floating Animation (Always on)
    useEffect(() => {
        float.value = withRepeat(
            withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );
    }, []);

    // 2. Breathing (Stronger at Level 3)
    useEffect(() => {
        if (level >= 3) {
            breath.value = withRepeat(
                withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );
        } else {
            breath.value = withTiming(0);
        }
    }, [level]);

    // 3. Glitching (Only at Level 1)
    useEffect(() => {
        if (level === 1) {
            // Random glitch interval
            const interval = setInterval(() => {
                if (Math.random() > 0.7) { // 30% chance to glitch
                    glitch.value = withSequence(
                        withTiming(5, { duration: 50 }),
                        withTiming(-5, { duration: 50 }),
                        withTiming(0, { duration: 50 })
                    );
                }
            }, 2000);
            return () => clearInterval(interval);
        } else {
            glitch.value = withTiming(0);
        }
    }, [level]);

    // Derived Styles
    const animatedStyle = useAnimatedStyle(() => {
        // Color Mapping based on Mood
        const baseColor = interpolateColor(
            mood,
            [0, 1],
            ['#A8A29E', '#F59E0B'] // Stone-400 (Numb) -> Amber-500 (Vibrant)
        );

        // Opacity/Glow based on Level
        const opacity = level === 1 ? withSequence(withTiming(0.6), withTiming(0.8)) : 1;
        const scale = interpolate(breath.value, [0, 1], [1, 1.1]);

        return {
            backgroundColor: baseColor,
            transform: [
                { translateY: interpolate(float.value, [0, 1], [-10, 10]) },
                { translateX: glitch.value },
                { scale: scale }
            ],
            opacity: level === 1 ? interpolate(glitch.value, [-5, 5], [0.5, 0.9]) : 1, // Flicker if glitching
            shadowColor: baseColor,
            shadowRadius: level === 3 ? interpolate(breath.value, [0, 1], [10, 30]) : 0,
            shadowOpacity: level === 3 ? 0.6 : 0,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.ghostBody, animatedStyle]}>
                {/* Eyes */}
                <View style={styles.eyeLeft} />
                <View style={styles.eyeRight} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        width: 200,
    },
    ghostBody: {
        width: 120,
        height: 140,
        borderRadius: 60, // Pill shape top
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    eyeLeft: {
        position: 'absolute',
        top: 40,
        left: 35,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    eyeRight: {
        position: 'absolute',
        top: 40,
        right: 35,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
    }
});
