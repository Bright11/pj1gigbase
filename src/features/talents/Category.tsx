
import React from 'react';
import { StyleSheet, View } from 'react-native';

import HeroBackground from '@/utils/HeroBackground';
import CategoryList from './CategoryList';

import { Mycolors } from '@/constants/mycolors';

export default function Category() {
  return (
    <View style={styles.container}>
      <HeroBackground />

      <View style={styles.categories}>
        <CategoryList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
  },

  categories: {
    flex: 1,
  },
});

