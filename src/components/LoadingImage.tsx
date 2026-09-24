import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  View,
} from 'react-native';

const placeholderImage = require('../assets/pngs/Placeholder.png');

const LoadingImage = ({
  source,
  placeholderSource = placeholderImage,
  style,
  resizeMode = 'cover',
  placeholderResizeMode,
  revealDelay = 0,
  ...props
}: any) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const pulse = useRef(new Animated.Value(0.45)).current;
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoading = !loaded && !failed;

  const resolvedPlaceholderResizeMode = placeholderResizeMode || resizeMode;

  useEffect(() => {
    if (!isLoading) {
      pulse.stopAnimation();
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.9,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
      if (revealTimer.current) {
        clearTimeout(revealTimer.current);
        revealTimer.current = null;
      }
    };
  }, [isLoading, pulse]);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={placeholderSource}
        style={StyleSheet.absoluteFill}
        resizeMode={resolvedPlaceholderResizeMode}
      />
      {!failed && (
        <Image
          {...props}
          source={source}
          style={[
            StyleSheet.absoluteFill,
            styles.image,
            loaded && styles.loaded,
          ]}
          resizeMode={resizeMode}
          onLoadStart={() => {
            if (revealTimer.current) clearTimeout(revealTimer.current);
            setLoaded(false);
            setFailed(false);
          }}
          onLoad={() => {
            if (revealDelay > 0) {
              revealTimer.current = setTimeout(
                () => setLoaded(true),
                revealDelay,
              );
            } else {
              setLoaded(true);
            }
          }}
          onError={() => setFailed(true)}
        />
      )}
      {isLoading && (
        <Animated.View style={[styles.loader, { opacity: pulse }]}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </Animated.View>
      )}
    </View>
  );
};

export default LoadingImage;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },
  image: {
    opacity: 0,
  },
  loaded: {
    opacity: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
});
