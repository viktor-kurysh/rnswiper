import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import Animated, { useValue, useCode, cond, eq, set, add, debug } from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {panGestureHandler, snapPoint, timing} from 'react-native-redash';

const {width, height} = Dimensions.get('screen');

export const assets = [
  require('./assets/images/image_1.jpg'),
  require('./assets/images/image_2.jpg'),
  require('./assets/images/image_3.jpg'),
];
const snapPoints = assets.map((_, i) => i * -width);

function App() {
  const offsetX = useValue(0);
  const translateX = useValue(0);
  const {gestureHandler, state, velocity, translation} = panGestureHandler();

  const to = snapPoint(translateX, velocity.x, snapPoints)

  useCode(() => [
    cond(eq(state, State.ACTIVE), [
      set(translateX, add(offsetX, translation.x)),
    ]),
    cond(eq(state, State.END), [
      set(translateX, timing({ from: translateX, to })),
      set(offsetX, translateX),
    ]),
  ], []);

  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={[styles.pictures, { transform: [{translateX}]}]}>
          {assets.map(source => (
            <View key={source} style={styles.picture}>
              <Image style={styles.image} {...{source}} />
            </View>
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pictures: {
    width: width * assets.length,
    flexDirection: 'row',
  },
  picture: {
    width: width,
    height: height,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default App;
