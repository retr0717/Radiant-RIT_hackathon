import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, PanResponder, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';

export interface PathData {
  path: string;
  color: string;
  strokeWidth: number;
}

interface DrawingCanvasProps {
  color: string;
  strokeWidth: number;
  paths: PathData[];
  onPathsChange: (paths: PathData[]) => void;
}

const DrawingCanvas = forwardRef<any, DrawingCanvasProps>(
  ({ color, strokeWidth, paths, onPathsChange }, ref) => {
    const [currentPath, setCurrentPath] = useState<string>('');
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    
    useImperativeHandle(ref, () => ({
      getPaths: () => paths,
      clearCanvas: () => onPathsChange([]),
      getCanvasSize: () => canvasSize,
    }));
    
    const pan = Gesture.Pan()
      .onStart((event) => {
        const { x, y } = event;
        setCurrentPath(`M${x},${y}`);
      })
      .onUpdate((event) => {
        const { x, y } = event;
        setCurrentPath(prev => `${prev} L${x},${y}`);
      })
      .onEnd(() => {
        if (currentPath) {
          onPathsChange([...paths, { path: currentPath, color, strokeWidth }]);
          setCurrentPath('');
        }
      });
    
    return (
      <View 
        style={styles.container}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCanvasSize({ width, height });
        }}
      >
        <GestureDetector gesture={pan}>
          <Animated.View style={styles.gestureContainer}>
            <Svg width="100%" height="100%">
              {paths.map((path, index) => (
                <Path
                  key={index}
                  d={path.path}
                  stroke={path.color}
                  strokeWidth={path.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {currentPath ? (
                <Path
                  d={currentPath}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : null}
            </Svg>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gestureContainer: {
    flex: 1,
  },
});

export default DrawingCanvas;