
import React, {
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  StatusBar,
} from 'react-native';

import CreateTalentForm from '@/features/talents/CreateTalentForm';
import { Mycolors } from '@/constants/mycolors';
import { router, useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProtectedRoute } from '@/utils/ProtectedRoute';
import { Talent } from '@/types/Talent';
import TalentVideoSection from '@/utils/TalentVideoSection';
import { getTalent } from '@/services/talent.service';
import TalentPhotoSection from '@/utils/TalentPhotoSource';

export default function PostTalentScreen() {
  const [step, setStep] = useState(1);
  const [talent, setTalent] = useState<Talent | null>(null);


  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '',
      headerStyle: {
        backgroundColor: Mycolors.primarycolor,
      },

      headerLeft: () => (
        <Pressable
          onPress={() => router.push('/my-talents')}
          style={styles.headerButton}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Mycolors.whitecolor}
          />
        </Pressable>
      ),

      headerRight: () => (
        <Pressable
          onPress={() => router.push('/login')}
          style={styles.headerButton}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Text style={styles.headerRightText}>
            Create new talent
          </Text>
        </Pressable>
      ),
    });
  }, [navigation]);
  /**
   * Called after CreateTalentForm successfully creates a talent.
   */
  const handleTalentCreated = (newTalent: Talent) => {
    console.log('Talent received by PostTalentScreen:', newTalent);

    setTalent(newTalent);

    // Automatically move to Step 2
    setStep(2);
  };

  /**
   * Refresh the talent from the API.
   */
  const loadTalent = useCallback(async () => {
    if (!talent?.id) return;

    try {
      const refreshedTalent = await getTalent(talent.id);

      setTalent(refreshedTalent);
    } catch (error) {
      console.error('Failed to refresh talent:', error);
    }
  }, [talent?.id]);



  const renderStep = () => {
    switch (step) {
      /**
       * STEP 1
       * Create basic talent information.
       */
      case 1:
        return (
          <CreateTalentForm
            onTalentCreated={handleTalentCreated}
          />
        );

      /**
       * STEP 2
       * Upload talent images/videos.
       */
      case 2:
        // Talent has not been created yet.
        if (!talent) {
          return (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderTitle}>
                Talent not found
              </Text>

              <Text style={styles.placeholderText}>
                Please create your talent first before uploading
                media.
              </Text>
            </View>
          );
        }

        // At this point TypeScript knows that talent is a Talent.
        return (
          <View style={styles.mediaContainer}>
            <TalentVideoSection
              talent={talent}
              onRefresh={loadTalent}
            />

            
             

             
           
          </View>
        );

      /**
       * STEP 3
       * Review and submit.
       */
      case 3:
         if (!talent) {
          return (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderTitle}>
                Talent not found
              </Text>

              <Text style={styles.placeholderText}>
                Please create your talent first before uploading
                media.
              </Text>
            </View>
          );
        }
        return (
          <View style={styles.placeholder}>
            {/* <Text style={styles.placeholderTitle}>
              Review and Submit
            </Text> */}

             <TalentPhotoSection
                talent={talent}
                onRefresh={loadTalent}
              />
          </View>
        );

      default:
        return null;
    }
  };

  /**
   * Move to the next step.
   */
  const handleNext = () => {
    // Don't allow Step 1 → Step 2 without creating a talent.
    if (step === 1) {
      if (!talent) {
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }
  };

  /**
   * Move to the previous step.
   */
  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <ProtectedRoute>
      <View style={styles.screen}>
        <StatusBar
          backgroundColor={Mycolors.primarycolor}
          barStyle="light-content"
        />

        {/* Step Header */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>
            {step === 1 && 'Step 1: Basic Information'}
            {step === 2 && 'Step 2: Additional Details'}
            {step === 3 && 'Step 3: Review and Submit'}
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              style={styles.progressItem}
            >
              <View
                style={[
                  styles.progressCircle,
                  item <= step &&
                    styles.progressCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.progressNumber,
                    item <= step &&
                      styles.progressNumberActive,
                  ]}
                >
                  {item}
                </Text>
              </View>

              {item < 3 && (
                <View
                  style={[
                    styles.progressLine,
                    item < step &&
                      styles.progressLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Current Step */}
        <View style={styles.content}>
          {renderStep()}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.navigation}>
          {/* Previous */}
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={step === 1}
            style={[
              styles.previousButton,
              step === 1 &&
                styles.disabledButton,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color={
                step === 1
                  ? Mycolors.graycolor
                  : Mycolors.primarycolor
              }
            />

            <Text
              style={[
                styles.previousText,
                step === 1 &&
                  styles.disabledText,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {/* Next */}
          {step ===3?(
            <TouchableOpacity
            onPress={() => {
             router.push('/my-talents');
            }}
            style={styles.nextButton}
          >
            <Text style={styles.nextText}>
             Finished
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={Mycolors.primarycolor}
            />
          </TouchableOpacity>
          ):(
             <TouchableOpacity
            onPress={handleNext}
            disabled={
              step === 3 ||
              (step === 1 && !talent)
            }
            style={[
              styles.nextButton,
              (step === 3 ||
                (step === 1 && !talent)) &&
                styles.disabledNextButton,
            ]}
          >
            <Text style={styles.nextText}>
             Next
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={Mycolors.primarycolor}
            />
          </TouchableOpacity>
          )}
         
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
  },

  headerButton: {
    padding: 8,
    marginHorizontal: 8,
  },

  headerRightText: {
    color: Mycolors.whitecolor,
    fontSize: 14,
    fontWeight: '600',
  },

  stepHeader: {
    backgroundColor: Mycolors.primarycolor,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },

  stepTitle: {
    color: Mycolors.whitecolor,
    fontSize: 16,
    fontWeight: '700',
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 18,
    backgroundColor: Mycolors.whitecolor,
  },

  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: Mycolors.graycolor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Mycolors.whitecolor,
  },

  progressCircleActive: {
    backgroundColor: Mycolors.secondarycolor,
    borderColor: Mycolors.secondarycolor,
  },

  progressNumber: {
    color: Mycolors.graycolor,
    fontSize: 14,
    fontWeight: '700',
  },

  progressNumberActive: {
    color: Mycolors.primarycolor,
  },

  progressLine: {
    width: 55,
    height: 2,
    backgroundColor: Mycolors.graycolor,
  },

  progressLineActive: {
    backgroundColor: Mycolors.secondarycolor,
  },

  content: {
    flex: 1,
  },

  mediaContainer: {
    flex: 1,
  },

  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  placeholderTitle: {
    color: Mycolors.primarycolor,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },

  placeholderText: {
    color: Mycolors.graycolor,
    fontSize: 14,
    textAlign: 'center',
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Mycolors.primarycolor,
    marginBottom: 50,
  },

  previousButton: {
    minWidth: 110,
    height: 46,
    borderRadius: 10,
    backgroundColor: Mycolors.whitecolor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  previousText: {
    color: Mycolors.primarycolor,
    fontSize: 14,
    fontWeight: '700',
  },

  nextButton: {
    minWidth: 110,
    height: 46,
    borderRadius: 10,
    backgroundColor: Mycolors.secondarycolor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  nextText: {
    color: Mycolors.primarycolor,
    fontSize: 14,
    fontWeight: '800',
  },

  disabledButton: {
    opacity: 0.45,
  },

  disabledNextButton: {
    opacity: 0.45,
  },

  disabledText: {
    color: Mycolors.graycolor,
  },
});

