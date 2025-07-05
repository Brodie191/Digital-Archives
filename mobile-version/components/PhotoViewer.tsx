import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
} from 'react-native';
import { Photo } from '../types';
import { supabase } from '../lib/supabaseClient';

interface PhotoViewerProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photos,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentPhoto = photos[currentIndex];
  const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(currentPhoto.name);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <TouchableOpacity style={styles.navButton} onPress={goToPrevious}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
      )}

      {currentIndex < photos.length - 1 && (
        <TouchableOpacity style={[styles.navButton, styles.rightNav]} onPress={goToNext}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      )}

      {/* Photo */}
      <Image
        source={{ uri: publicUrl }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Photo counter */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {photos.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#f5f1e8',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  rightNav: {
    left: undefined,
    right: 20,
  },
  navButtonText: {
    color: '#f5f1e8',
    fontSize: 30,
    fontWeight: 'bold',
  },
  counter: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  counterText: {
    color: '#f5f1e8',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
}); 