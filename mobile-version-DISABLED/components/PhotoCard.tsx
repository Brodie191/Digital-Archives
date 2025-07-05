import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Photo, PhotoWithUrl } from '../types';
import { supabase } from '../lib/supabaseClient';

interface PhotoCardProps {
  photo: PhotoWithUrl;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: photo.url }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: cardWidth,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
}); 