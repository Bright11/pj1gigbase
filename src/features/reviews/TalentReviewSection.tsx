
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Mycolors } from '@/constants/mycolors';
import {
  submitTalentReview,
} from '@/services/talent.service';
import type { TalentReview } from '@/types/Talent';
import { getApiErrorMessage } from '@/services/api.error';

interface TalentReviewSectionProps {
  talentId: number;
  reviews: TalentReview[];
  reviewCount: number;
  isAuthenticated: boolean;
  onReviewSubmitted: () => Promise<void>;
}

export default function TalentReviewSection({
  talentId,
  reviews,
  reviewCount,
  isAuthenticated,
  onReviewSubmitted,
}: TalentReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(
        'Rating Required',
        'Please select a rating from 1 to 5 stars.',
      );
      return;
    }

    try {
      setLoading(true);

      await submitTalentReview(
        talentId,
        rating,
        comment,
      );

      setRating(0);
      setComment('');

      await onReviewSubmitted();

      Alert.alert(
        'Review Submitted',
        'Your review has been submitted successfully.',
      );
    } catch (error) {
      console.error(
        'Review submission failed:',
         getApiErrorMessage(error),
      );

      Alert.alert(
        'Unable to Submit Review',
        error instanceof Error
          ? getApiErrorMessage(error)
          : 'Failed to submit your review.',
      );
     console.error(
        'Review submission failed:',
         getApiErrorMessage(error),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------ */}
      {/* Review Summary                                   */}
      {/* ------------------------------------------------ */}

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            CLIENT FEEDBACK
          </Text>

          <Text style={styles.sectionTitle}>
            Reviews
          </Text>
        </View>

        <View style={styles.reviewCountContainer}>
          <Text style={styles.reviewCount}>
            {reviewCount}
          </Text>

          <Text style={styles.reviewCountLabel}>
            {reviewCount === 1 ? 'review' : 'reviews'}
          </Text>
        </View>
      </View>

      {/* ------------------------------------------------ */}
      {/* Existing Reviews                                 */}
      {/* ------------------------------------------------ */}

      {reviews.length === 0 ? (
        <View style={styles.emptyReviews}>
          <Text style={styles.emptyTitle}>
            No reviews yet
          </Text>

          <Text style={styles.emptyText}>
            Be the first client to share your experience.
          </Text>
        </View>
      ) : (
        <View style={styles.reviewList}>
          {reviews.map((review) => (
            <View
              key={review.id}
              style={styles.reviewCard}
            >
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {review.reviewer_name
                      ?.charAt(0)
                      ?.toUpperCase() || '?'}
                  </Text>
                </View>

                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>
                    {review.reviewer_name}
                  </Text>

                  <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Text
                          key={star}
                          style={[
                            styles.starSmall,
                            star <= review.rating &&
                              styles.starSmallActive,
                          ]}
                        >
                          ★
                        </Text>
                      ),
                    )}
                  </View>
                </View>
              </View>

              {review.comment ? (
                <Text style={styles.comment}>
                  {review.comment}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      )}

      {/* ------------------------------------------------ */}
      {/* Leave Review                                     */}
      {/* ------------------------------------------------ */}

      {isAuthenticated && (
        <View style={styles.formCard}>
          <Text style={styles.formEyebrow}>
            TALENT EXPERIENCE
          </Text>

          <Text style={styles.formTitle}>
            Leave a Review
          </Text>

          <Text style={styles.formDescription}>
            Share your experience with this talent.
            Your feedback helps other clients make
            informed decisions.
          </Text>

          {/* Rating */}

          <Text style={styles.label}>
            Rating
          </Text>

          <View style={styles.ratingSelector}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setRating(value)}
                disabled={loading}
                style={styles.starButton}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.starLarge,
                    value <= rating &&
                      styles.starLargeActive,
                  ]}
                >
                  {value <= rating ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}

            {rating > 0 && (
              <Text style={styles.ratingText}>
                {rating}/5
              </Text>
            )}
          </View>

          {/* Comment */}

          <Text style={styles.label}>
            Your Review
          </Text>

          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            editable={!loading}
            style={styles.textarea}
          />

          {/* Submit */}

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <>
                <ActivityIndicator
                  color={Mycolors.whitecolor}
                />

                <Text style={styles.submitText}>
                  Submitting...
                </Text>
              </>
            ) : (
              <Text style={styles.submitText}>
                Submit Review
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: Mycolors.primarycolor,
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  reviewCountContainer: {
    alignItems: 'flex-end',
  },

  reviewCount: {
    fontSize: 18,
    fontWeight: '800',
    color: Mycolors.primarycolor,
  },

  reviewCountLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  emptyReviews: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },

  reviewList: {
    gap: 12,
  },

  reviewCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Mycolors.whitecolor,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Mycolors.primarycolor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: Mycolors.whitecolor,
    fontSize: 16,
    fontWeight: '800',
  },

  reviewerInfo: {
    marginLeft: 10,
    flex: 1,
  },

  reviewerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  stars: {
    flexDirection: 'row',
    marginTop: 3,
  },

  starSmall: {
    fontSize: 14,
    color: '#D1D5DB',
    marginRight: 2,
  },

  starSmallActive: {
    color: '#F59E0B',
  },

  comment: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: '#374151',
  },

  formCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  formEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: Mycolors.primarycolor,
    marginBottom: 4,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  formDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
  },

  label: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  ratingSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  starButton: {
    paddingRight: 5,
  },

  starLarge: {
    fontSize: 32,
    color: '#D1D5DB',
  },

  starLargeActive: {
    color: '#F59E0B',
  },

  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },

  textarea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: Mycolors.whitecolor,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },

  submitButton: {
    marginTop: 14,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: Mycolors.primarycolor,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitText: {
    color: Mycolors.whitecolor,
    fontSize: 14,
    fontWeight: '800',
  },
});


