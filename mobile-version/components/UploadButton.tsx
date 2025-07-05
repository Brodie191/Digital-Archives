import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabaseClient';

interface UploadButtonProps {
  onUploadSuccess: () => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload photos!'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (imageAsset: ImagePicker.ImagePickerAsset) => {
    try {
      setUploading(true);

      const response = await fetch(imageAsset.uri);
      const blob = await response.blob();
      
      const fileName = `${Date.now()}_${imageAsset.fileName || 'photo.jpg'}`;
      
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        Alert.alert('Upload Failed', error.message);
        return;
      }

      Alert.alert('Success', 'Photo uploaded successfully!');
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'An error occurred while uploading the photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, uploading && styles.buttonDisabled]}
      onPress={pickImage}
      disabled={uploading}
      activeOpacity={0.8}
    >
      {uploading ? (
        <ActivityIndicator color="#000" size="small" />
      ) : (
        <Text style={styles.buttonText}>+</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f1e8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
}); 