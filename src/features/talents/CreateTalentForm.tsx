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
import type { Category } from '@/types/category';
import { getcategories } from '@/services/category.service';
import { CreateTalentRequest } from '@/types/Talent';
import { createTalent } from '@/services/talent.service';
import { Mycolors } from '@/constants/mycolors';
import { getApiErrorMessage } from '@/services/api.error';

export default function CreateTalentForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [stageName, setStageName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [fixedRate, setFixedRate] = useState('');
  const [currency, setCurrency] = useState('GHS');

  const [showCategories, setShowCategories] = useState(false);

  const [isLoadingCategories, setIsLoadingCategories] =
    useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getcategories();
        setCategories(data);
      } catch (error) {
      
        console.error(
          'Failed to load categories:',
          error
        );
      

        Alert.alert(
          'Error',
          'Unable to load categories.'
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

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

    const data: CreateTalentRequest = {
      stage_name: stageName.trim() || undefined,
      category: selectedCategory.id,
      title: title.trim(),
      bio: bio.trim() || undefined,
      hourly_rate: hourlyRate.trim() || undefined,
      fixed_rate: fixedRate.trim() || undefined,
      currency: currency.trim() || 'GHS',
    };

    try {
      setIsSubmitting(true);

      const response = await createTalent(data);
      

      console.log(
        'Talent created successfully:',
        response
      );

      Alert.alert(
        'Success',
        'Your talent has been created.'
      );

    } catch (error) {
        const message = getApiErrorMessage(error)
      console.error(
        'Create talent error:',
        error
      );
        
        console.log("ssssss", message)
      Alert.alert(
        'Error',
        message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.heading}>
        Post Your Talent
      </Text>

      <Text style={styles.description}>
        Create a talent profile that clients can
        discover and book.
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
            setShowCategories(!showCategories)
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
            {isLoadingCategories ? (
              <ActivityIndicator
                style={styles.loader}
              />
            ) : (
              categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategories(false);
                  }}
                >
                  <Text style={styles.categoryText}>
                    {category.name}
                  </Text>
                </Pressable>
              ))
            )}
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
          isSubmitting && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Post Talent
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
    backgroundColor:Mycolors.whitecolor,

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
    borderColor: Mycolors.graycolor,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  textArea: {
    height: 120,
    paddingTop: 14,
     borderColor: Mycolors.graycolor,
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
    backgroundColor: Mycolors.primarycolor,
    marginBottom:6,
  },

  categoryText: {
    fontSize: 16,
    color:Mycolors.whitecolor
  },

  loader: {
    padding: 15,
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