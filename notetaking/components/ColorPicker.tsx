import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const COLORS = [
  '#000000', // Black
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
];

const STROKE_WIDTHS = [1, 2, 3, 5, 8, 12];

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  currentStrokeWidth: number;
  onSelectStrokeWidth: (width: number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelectColor,
  currentStrokeWidth,
  onSelectStrokeWidth,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Colors</Text>
      <View style={styles.colorGrid}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorItem,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColorItem,
            ]}
            onPress={() => onSelectColor(color)}
          />
        ))}
      </View>
      
      <Text style={styles.title}>Stroke Width</Text>
      <View style={styles.strokeWidthContainer}>
        {STROKE_WIDTHS.map((width) => (
          <TouchableOpacity
            key={width}
            style={[
              styles.strokeWidthItem,
              currentStrokeWidth === width && styles.selectedStrokeWidthItem,
            ]}
            onPress={() => onSelectStrokeWidth(width)}
          >
            <View 
              style={[
                styles.strokeWidthPreview, 
                { 
                  height: width,
                  backgroundColor: selectedColor,
                }
              ]} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  colorItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedColorItem: {
    borderWidth: 3,
    borderColor: '#94a3b8',
  },
  strokeWidthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strokeWidthItem: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedStrokeWidthItem: {
    backgroundColor: '#f1f5f9',
    borderColor: '#94a3b8',
  },
  strokeWidthPreview: {
    width: '80%',
    borderRadius: 4,
  },
});

export default ColorPicker;