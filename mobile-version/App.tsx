import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from './lib/supabaseClient';
import { Photo } from './types';
import { PhotoCard } from './components/PhotoCard';
import { PhotoViewer } from './components/PhotoViewer';
import { UploadButton } from './components/UploadButton';

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .storage
        .from('photos')
        .list('', { limit: 100 });

      if (error) {
        console.error('Error loading photos:', error);
        Alert.alert('Error', 'Failed to load photos');
        return;
      }

      // Sort by the numeric timestamp at the start of each filename (newest first)
      const sorted = (data as Photo[]).sort((a, b) => {
        const aTs = Number(a.name.split('_')[0]);
        const bTs = Number(b.name.split('_')[0]);
        return bTs - aTs;
      });
      
      setPhotos(sorted);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseViewer = () => {
    setSelectedPhotoIndex(null);
  };

  const handleUploadSuccess = () => {
    loadPhotos(); // Reload photos after successful upload
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f5f1e8" />
        <Text style={styles.loadingText}>Loading your photos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.header}>
        <Text style={styles.title}>My Digital Library</Text>
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No photos yet. Tap the upload button to add your first photo!
          </Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PhotoCard
              photo={item}
              onPress={() => handlePhotoPress(index)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <UploadButton onUploadSuccess={handleUploadSuccess} />

      {selectedPhotoIndex !== null && (
        <PhotoViewer
          photos={photos}
          initialIndex={selectedPhotoIndex}
          onClose={handleCloseViewer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#f5f1e8',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f5f1e8',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    color: '#f5f1e8',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});
