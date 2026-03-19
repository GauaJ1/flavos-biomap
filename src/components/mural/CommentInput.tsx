import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/colors';

interface Props {
  onSubmit: (text: string, author: string) => void;
}

export const CommentInput = ({ onSubmit }: Props) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@userName').then(savedName => {
      if (savedName) setAuthor(savedName);
    });
  }, []);

  const handleSend = async () => {
    const finalAuthor = author.trim() || 'Visitante Anônimo';
    if (text.trim().length > 0) {
      if (author.trim()) {
        await AsyncStorage.setItem('@userName', author.trim());
      }
      onSubmit(text.trim(), finalAuthor);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.nameInput}
        placeholder="Seu nome (opcional)"
        placeholderTextColor="#A0A0A0"
        value={author}
        onChangeText={setAuthor}
        maxLength={30}
      />
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Deixe seu saber sobre o produto..."
          placeholderTextColor="#A0A0A0"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={300}
        />
        <TouchableOpacity 
          style={[styles.sendButton, text.trim() ? styles.sendActive : null]} 
          onPress={handleSend}
          disabled={!text.trim()}
          activeOpacity={0.8}
        >
          <Feather name="send" size={20} color={text.trim() ? COLORS.surface : '#A0A0A0'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F1EA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2DBCF',
  },
  nameInput: {
    fontSize: 14,
    color: '#1E5631',
    fontWeight: '600',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2DBCF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 15,
    color: COLORS.text,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBE6DF',
    marginLeft: 12,
    marginBottom: 4,
  },
  sendActive: {
    backgroundColor: COLORS.primary,
  }
});
