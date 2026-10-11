import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';


import type { Talent,TalentCategory, TalentLevel } from '@/types/Talent';

import { getcategories } from '@/services/category.service';
import {
  getTalent,
  updateTalent,
} from '@/services/talent.service';

import { Mycolors } from '@/constants/mycolors';
import { getApiErrorMessage } from '@/services/api.error';
import { Category } from '@/types/category';
import { levelData } from '@/utils/levelData';

export default function EditTalentForm() {

//  const [level, setLevel] =
//   useState<TalentLevel>('beginner');
const [level, setLevel] = useState<TalentLevel | ''>('');

const [showLevels, setShowLevels] =
  useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();

  const [talent, setTalent] =
    useState<Talent | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<TalentCategory | null>(null);

  const [stageName, setStageName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [fixedRate, setFixedRate] = useState('');
  const [currency, setCurrency] = useState('GHS');

  const [showCategories, setShowCategories] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

 
  const loadData = async () => {
  if (!id) {
    return;
  }

  try {
    setIsLoading(true);

    const [talentData, categoryData] =
  await Promise.all([
    getTalent(Number(id)),
    getcategories(1, 100),
  ]);

setTalent(talentData);
setCategories(categoryData.results);

    setStageName(
      talentData.stage_name ?? ''
    );

    setTitle(
      talentData.title ?? ''
    );

    setBio(
      talentData.bio ?? ''
    );

    setHourlyRate(
      talentData.hourly_rate ?? ''
    );

    setFixedRate(
      talentData.fixed_rate ?? ''
    );

    setCurrency(
      talentData.currency ?? 'GHS'
    );

    setSelectedCategory(
      talentData.category_details ?? null
    );
    setLevel(
  talentData?.level ?? ''
);

  } catch (error) {
    console.error(
      'Failed to load talent:',
      error
    );

    Alert.alert(
      'Error',
      getApiErrorMessage(error),
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert(
        'Required',
        'Please enter your talent title.'
      );
      return;
    }

    if (!selectedCategory) {
      Alert.alert(
        'Required',
        'Please select a category.'
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const data = {
        stage_name:
          stageName.trim() || undefined,

        category:
          selectedCategory.id,

        title:
          title.trim(),

        bio:
          bio.trim() || undefined,

        hourly_rate:
          hourlyRate.trim() || undefined,

        fixed_rate:
          fixedRate.trim() || undefined,

        currency:
          currency.trim() || 'GHS',
            level: level,
            
      };

      const response =
        await updateTalent(
          Number(id),
          data
        );

      console.log(
        'Talent updated successfully:',
        response
      );

      Alert.alert(
        'Success',
        'Your talent has been updated.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace(
                '/my-talents'
              );
            },
          },
        ]
      );

    } catch (error) {
      console.error(
        'Update talent error:',
        error
      );

      Alert.alert(
        'Error',
        getApiErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading talent...
        </Text>
      </View>
    );
  }

  if (!talent) {
    return null;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.heading}>
        Edit Talent
      </Text>

      <Text style={styles.description}>
        Update your talent profile information.
      </Text>

      {/* Stage Name */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Stage Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. DJ Bright"
          value={stageName}
          onChangeText={setStageName}
        />
      </View>

      {/* Category */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Category *
        </Text>

        <Pressable
          style={styles.selector}
          onPress={() =>
            setShowCategories(
              !showCategories
            )
          }
        >
          <Text
            style={
              selectedCategory
                ? styles.selectedText
                : styles.placeholder
            }
          >
            {selectedCategory?.name ??
              'Select a category'}
          </Text>
        </Pressable>

        {showCategories && (
          <View style={styles.categoryList}>
            {categories.map(
              (category) => (
                <Pressable
                  key={category.id}
                  style={styles.categoryItem}
                 onPress={() => {
                setSelectedCategory({
                    id: category.id,
                    name: category.name,
                    avatar: category.avatar,
                    image: category.image,
                    description: category.description,
                    slug: category.slug,
                    created_at: category.created_at,
                });

                setShowCategories(false);
                }}
                >
                  <Text
                    style={
                      styles.categoryText
                    }
                  >
                    {category.name}
                  </Text>
                </Pressable>
              )
            )}
          </View>
        )}
      </View>

      {/* select level */}
     <View style={styles.field}>
  <Text style={styles.label}>Talent Level*</Text>

  <Pressable
    style={styles.selector}
    onPress={() => setShowLevels(!showLevels)}
  >
    <Text
      style={
        level
          ? styles.selectedText
          : styles.placeholder
      }
    >
      {
        levelData.find(
          (item) => item.value === level
        )?.label ?? 'Select a level'
      }
    </Text>
  </Pressable>

  {showLevels && (
    <View style={styles.categoryList}>
      {levelData.map((item) => (
        <Pressable
          key={item.value}
          style={styles.categoryItem}
          onPress={() => {
            setLevel(item.value);
            setShowLevels(false);
          }}
        >
          <Text style={styles.categoryText}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )}
</View>

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Talent Title *
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Professional DJ"
          value={title}
          onChangeText={setTitle}
        />
      </View>

    

      {/* Bio */}
      <View style={styles.field}>
        <Text style={styles.label}>
          About Your Talent
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.textArea,
          ]}
          placeholder="Tell clients about your talent..."
          value={bio}
          onChangeText={setBio}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Hourly Rate */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Hourly Rate
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 500"
          value={hourlyRate}
          onChangeText={setHourlyRate}
          keyboardType="decimal-pad"
        />
      </View>

      {/* Fixed Rate */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Fixed/Event Rate
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 1500"
          value={fixedRate}
          onChangeText={setFixedRate}
          keyboardType="decimal-pad"
        />
      </View>

      {/* Currency */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Currency
        </Text>

        <TextInput
          style={styles.input}
          placeholder="GHS"
          value={currency}
          onChangeText={setCurrency}
          autoCapitalize="characters"
          maxLength={10}
        />
      </View>

      {/* Submit */}
      <Pressable
        style={[
          styles.button,
          isSubmitting &&
            styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Save Changes
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor:
      Mycolors.whitecolor,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Mycolors.whitecolor,
  },

  loadingText: {
    marginTop: 10,
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    marginBottom: 28,
    opacity: 0.7,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor:
      Mycolors.graycolor,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  textArea: {
    height: 120,
    paddingTop: 14,
    borderColor:
      Mycolors.graycolor,
  },

  selector: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  placeholder: {
    color: '#777',
    fontSize: 16,
  },

  selectedText: {
    fontSize: 16,
  },

  categoryList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
  },

  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    backgroundColor:
      Mycolors.primarycolor,
    marginBottom: 6,
  },

  categoryText: {
    fontSize: 16,
    color:
      Mycolors.whitecolor,
  },

  button: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});