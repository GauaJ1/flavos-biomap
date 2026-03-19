import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Comment } from '../../types/comment';
import { COLORS } from '../../constants/colors';

interface Props {
  comment: Comment;
}

export const CommentCard = ({ comment }: Props) => {
  const dateObj = new Date(comment.createdAt);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const dateStr = `${day} ${month} ${hours}:${minutes}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.author}>{comment.authorName}</Text>
        <Text style={styles.date}>{dateStr}</Text>
      </View>
      <Text style={styles.content}>{comment.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F6F0',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E5631',
  },
  date: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  content: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  }
});
