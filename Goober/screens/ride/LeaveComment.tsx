// /screens/LeaveComment.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LeaveCommentScreenProps } from '../types/navigation';

export default function LeaveComment({ navigation }: LeaveCommentScreenProps) {
  const [comment, setComment] = useState('');

  const handleDone = () => {
    navigation.navigate('Home');
  };

  return (
    <Modal visible={true} animationType="slide" transparent>
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Leave a comment?</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Ride Info */}
            <View style={styles.rideInfo}>
              <View style={styles.rideDetails}>
                <Text style={styles.rideText}>Ride share with Diran Olakunle</Text>
                <Text style={styles.rideDate}>Fri 18 Aug, 06:00 AM</Text>
              </View>
              <View style={styles.driverImage}>
                <Ionicons name="person" size={24} color="#999" />
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={10} color="#fff" />
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Comment Input */}
            <View style={styles.commentSection}>
              <TextInput
                style={styles.commentInput}
                placeholder="Leave a comment"
                placeholderTextColor="#999"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Done Button */}
            <View style={styles.bottomActions}>
              <TouchableOpacity
                style={[styles.doneButton, comment.length > 0 && styles.doneButtonActive]}
                onPress={handleDone}
                disabled={comment.length === 0}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  rideInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  rideDetails: {
    flex: 1,
  },
  rideText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF8800',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 20,
  },
  commentSection: {
    padding: 20,
  },
  commentInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  bottomActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  doneButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    opacity: 0.5,
  },
  doneButtonActive: {
    opacity: 1,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

