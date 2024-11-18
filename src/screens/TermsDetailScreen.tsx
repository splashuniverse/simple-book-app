import React from 'react';
import {ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {Button, Text} from '@rneui/themed';
import RenderHtml from 'react-native-render-html';
import {TermsScreenProps} from '../types/navigationType';

const TermsDetailScreen = ({route, navigation}: TermsScreenProps) => {
  const {title, content} = route.params;
  const {width, height} = useWindowDimensions();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <RenderHtml contentWidth={width} source={{html: content}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default TermsDetailScreen;
