
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import * as ImagePicker from 'expo-image-picker';

import Ionicons from '@expo/vector-icons/Ionicons';

import { Mycolors } from '@/constants/mycolors';
import { ProtectedRoute } from '@/utils/ProtectedRoute';

import { useAuthStore } from '@/store/auth.store';

import {
  getCurrentUser,
  logout,
} from '@/services/auth.service';

import {
  updateProfileImage,
} from '@/services/profile.service';

export default function ProfileScreen() {
  const user = useAuthStore(
    (state) => state.user
  );

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  const [uploadingImage, setUploadingImage] =
    useState(false);

  /* =========================
     REFRESH PROFILE
  ========================= */

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const refreshProfile = async () => {
        try {
          const currentUser =
            await getCurrentUser();

          if (isActive) {
            setUser(currentUser);
          }
        } catch (error) {
          console.error(
            'PROFILE REFRESH FAILED:',
            error
          );
        }
      };

      refreshProfile();

      return () => {
        isActive = false;
      };
    }, [setUser])
  );

  /* =========================
     PROFILE IMAGE
  ========================= */

  const handleChangeProfileImage =
    async () => {
      try {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
          Alert.alert(
            'Permission required',
            'Please allow photo library access to change your profile picture.'
          );

          return;
        }

        const result =
          await ImagePicker.launchImageLibraryAsync(
            {
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            }
          );

        if (result.canceled) {
          return;
        }

        const image =
          result.assets[0];

        setUploadingImage(true);

        const response =
          await updateProfileImage({
            uri: image.uri,
            fileName: image.fileName,
            mimeType: image.mimeType,
          });

        const currentUser =
          useAuthStore.getState().user;

        if (
          currentUser &&
          response.profile_picture
        ) {
          setUser({
            ...currentUser,

            profile: {
              ...currentUser.profile,

              profile_picture:
                response.profile_picture,
            },
          });
        }
      } catch (error: any) {
        console.log(
          'Profile image update error:',
          error?.response?.data || error
        );

        Alert.alert(
          'Upload failed',
          'Unable to update your profile picture. Please try again.'
        );
      } finally {
        setUploadingImage(false);
      }
    };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out of your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.log(
                'Logout error:',
                error
              );
            }
          },
        },
      ]
    );
  };

  /* =========================
     EMPTY
  ========================= */

  if (!user) {
    return (
      <ProtectedRoute>
        <View style={styles.center}>
          <Ionicons
            name="person-circle-outline"
            size={60}
            color={Mycolors.graycolor}
          />

          <Text style={styles.emptyText}>
            Unable to load profile.
          </Text>
        </View>
      </ProtectedRoute>
    );
  }

  const profile = user.profile;

  const fullName = [
    profile.first_name,
    profile.last_name,
  ]
    .filter(Boolean)
    .join(' ');

  const displayName =
    fullName || user.username;

  const location = [
    profile.city,
    profile.country,
  ]
    .filter(Boolean)
    .join(', ');

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return 'Not provided';
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString();
  };

  const profilePicture =
    profile.profile_picture;

  return (
    <ProtectedRoute>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          Mycolors.primarycolor
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
      >

        {/* =========================
            PROFILE HERO
        ========================= */}

        <View style={styles.hero}>

          <View style={styles.heroGlow} />

          <Pressable
            onPress={
              handleChangeProfileImage
            }
            disabled={uploadingImage}
            style={styles.avatarWrap}
          >
            {profilePicture ? (
              <Image
                source={{
                  uri: profilePicture,
                }}
                style={styles.profileImage}
              />
            ) : (
              <View
                style={
                  styles.profilePlaceholder
                }
              >
                <Text
                  style={
                    styles.profileInitial
                  }
                >
                  {user.username
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              </View>
            )}

            <View
              style={styles.cameraBadge}
            >
              {uploadingImage ? (
                <ActivityIndicator
                  size="small"
                  color={
                    Mycolors.primarycolor
                  }
                />
              ) : (
                <Ionicons
                  name="camera"
                  size={15}
                  color={
                    Mycolors.primarycolor
                  }
                />
              )}
            </View>
          </Pressable>

          {uploadingImage && (
            <Text
              style={styles.uploadingText}
            >
              Updating profile photo...
            </Text>
          )}

          <Text style={styles.name}>
            {displayName}
          </Text>

          <Text style={styles.username}>
            @{user.username}
          </Text>

          {user.is_verified && (
            <View
              style={styles.verifiedBadge}
            >
              <Ionicons
                name="checkmark-circle"
                size={15}
                color={
                  Mycolors.greencolor
                }
              />

              <Text
                style={
                  styles.verifiedText
                }
              >
                Verified account
              </Text>
            </View>
          )}
        </View>

        {/* =========================
            QUICK INFO
        ========================= */}

        <View
          style={styles.quickInfo}
        >
          <QuickInfo
            icon="location-outline"
            label={
              location || 'Location not set'
            }
          />

          <View
            style={styles.quickDivider}
          />

          <QuickInfo
            icon="mail-outline"
            label={user.email}
          />
        </View>

        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

        <View style={styles.section}>

          <SectionHeader
            icon="person-outline"
            title="Personal Information"
          />

          <ProfileRow
            icon="text-outline"
            label="Full name"
            value={
              fullName ||
              'Not provided'
            }
          />

          <ProfileRow
            icon="mail-outline"
            label="Email"
            value={
              user.email ||
              'Not provided'
            }
          />

          <ProfileRow
            icon="call-outline"
            label="Phone"
            value={
              profile.phone_number ||
              'Not provided'
            }
          />

          <ProfileRow
            icon="calendar-outline"
            label="Date of birth"
            value={formatDate(
              profile.date_of_birth
            )}
          />

          <ProfileRow
            icon="male-female-outline"
            label="Gender"
            value={
              profile.gender ||
              'Not provided'
            }
          />

          <ProfileRow
            icon="location-outline"
            label="Location"
            value={
              location ||
              'Not provided'
            }
            last
          />
        </View>

        {/* =========================
            ABOUT
        ========================= */}

        <View style={styles.section}>

          <SectionHeader
            icon="chatbox-ellipses-outline"
            title="About Me"
          />

          <Text style={styles.bio}>
            {profile.bio ||
              'No bio added yet.'}
          </Text>
        </View>

        {/* =========================
            EDIT PROFILE
        ========================= */}

        <Pressable
          style={({ pressed }) => [
            styles.editButton,

            pressed &&
              styles.buttonPressed,
          ]}
          onPress={() =>
            router.push(
              '/profile/edit'
            )
          }
        >
          <Ionicons
            name="create-outline"
            size={19}
            color={
              Mycolors.primarycolor
            }
          />

          <Text
            style={
              styles.editButtonText
            }
          >
            Edit Profile
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={
              Mycolors.primarycolor
            }
          />
        </Pressable>

        {/* =========================
            ACCOUNT
        ========================= */}

        <View style={styles.accountSection}>

          <Text
            style={styles.accountTitle}
          >
            Account
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.accountRow,

              pressed &&
                styles.rowPressed,
            ]}
            onPress={() =>
              Alert.alert(
                'Coming soon',
                'Account settings will be available soon.'
              )
            }
          >
            <View
              style={styles.accountIcon}
            >
              <Ionicons
                name="settings-outline"
                size={19}
                color={
                  Mycolors.primarycolor
                }
              />
            </View>

            <View
              style={styles.accountText}
            >
              <Text
                style={
                  styles.accountRowTitle
                }
              >
                Account Settings
              </Text>

              <Text
                style={
                  styles.accountRowSubtitle
                }
              >
                Manage your account
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#AAA"
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.accountRow,

              pressed &&
                styles.rowPressed,
            ]}
            onPress={handleLogout}
          >
            <View
              style={[
                styles.accountIcon,
                styles.logoutIcon,
              ]}
            >
              <Ionicons
                name="log-out-outline"
                size={19}
                color={
                  Mycolors.redcolor
                }
              />
            </View>

            <View
              style={styles.accountText}
            >
              <Text
                style={[
                  styles.accountRowTitle,
                  styles.logoutText,
                ]}
              >
                Log Out
              </Text>

              <Text
                style={
                  styles.accountRowSubtitle
                }
              >
                Sign out of your account
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#AAA"
            />
          </Pressable>
        </View>

        <Text
          style={styles.version}
        >
          PJ1 GigBase
        </Text>

      </ScrollView>
    </ProtectedRoute>
  );
}

/* =====================================================
   SECTION HEADER
===================================================== */

function SectionHeader({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View
      style={styles.sectionHeader}
    >
      <View
        style={styles.sectionIcon}
      >
        <Ionicons
          name={icon}
          size={17}
          color={
            Mycolors.secondarycolor
          }
        />
      </View>

      <Text
        style={styles.sectionTitle}
      >
        {title}
      </Text>
    </View>
  );
}

/* =====================================================
   QUICK INFO
===================================================== */

function QuickInfo({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View
      style={styles.quickItem}
    >
      <Ionicons
        name={icon}
        size={15}
        color={
          Mycolors.secondarycolor
        }
      />

      <Text
        style={styles.quickText}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

/* =====================================================
   PROFILE ROW
===================================================== */

function ProfileRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        last && styles.lastRow,
      ]}
    >
      <View
        style={styles.rowLabelWrap}
      >
        <Ionicons
          name={icon}
          size={16}
          color="#9CA3AF"
        />

        <Text style={styles.label}>
          {label}
        </Text>
      </View>

      <Text
        style={styles.value}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  content: {
    paddingBottom: 45,
  },

  /* =========================
     HERO
  ========================= */

  hero: {
    alignItems: 'center',

    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 20,

    backgroundColor:
      Mycolors.primarycolor,

    overflow: 'hidden',
  },

  heroGlow: {
    position: 'absolute',

    width: 180,
    height: 180,

    borderRadius: 90,

    top: -90,
    right: -50,

    backgroundColor:
      'rgba(247,185,40,0.10)',
  },

  avatarWrap: {
    position: 'relative',
  },

  profileImage: {
    width: 110,
    height: 110,

    borderRadius: 55,

    borderWidth: 4,

    borderColor:
      Mycolors.secondarycolor,
  },

  profilePlaceholder: {
    width: 110,
    height: 110,

    borderRadius: 55,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#1B1F48',

    borderWidth: 4,

    borderColor:
      Mycolors.secondarycolor,
  },

  profileInitial: {
    fontSize: 40,

    fontWeight: '800',

    color:
      Mycolors.whitecolor,
  },

  cameraBadge: {
    position: 'absolute',

    right: 2,
    bottom: 2,

    width: 32,
    height: 32,

    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      Mycolors.secondarycolor,

    borderWidth: 3,

    borderColor:
      Mycolors.primarycolor,
  },

  uploadingText: {
    marginTop: 10,

    color:
      'rgba(255,255,255,0.65)',

    fontSize: 11,
  },

  name: {
    marginTop: 14,

    color:
      Mycolors.whitecolor,

    fontSize: 22,

    fontWeight: '800',
  },

  username: {
    marginTop: 3,

    color:
      'rgba(255,255,255,0.60)',

    fontSize: 13,
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 10,

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor:
      'rgba(94,141,72,0.18)',
  },

  verifiedText: {
    marginLeft: 5,

    color:
      '#9DD585',

    fontSize: 11,

    fontWeight: '700',
  },

  /* =========================
     QUICK INFO
  ========================= */

  quickInfo: {
    flexDirection: 'row',

    alignItems: 'center',

    marginHorizontal: 16,
    marginTop: -1,

    paddingHorizontal: 14,
    paddingVertical: 13,

    borderRadius: 14,

    backgroundColor:
      Mycolors.whitecolor,

    borderWidth: 1,

    borderColor: '#ECEEF2',

    elevation: 2,
  },

  quickItem: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,
  },

  quickText: {
    flex: 1,

    color: '#666',

    fontSize: 11,

    fontWeight: '500',
  },

  quickDivider: {
    width: 1,
    height: 25,

    marginHorizontal: 10,

    backgroundColor: '#E5E7EB',
  },

  /* =========================
     SECTION
  ========================= */

  section: {
    marginHorizontal: 16,
    marginTop: 18,

    padding: 16,

    borderRadius: 16,

    backgroundColor:
      Mycolors.whitecolor,

    borderWidth: 1,

    borderColor: '#ECEEF2',
  },

  sectionHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 6,
  },

  sectionIcon: {
    width: 34,
    height: 34,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,

    backgroundColor:
      '#FFF7DF',
  },

  sectionTitle: {
    color:
      Mycolors.primarycolor,

    fontSize: 15,

    fontWeight: '800',
  },

  /* =========================
     ROWS
  ========================= */

  row: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingVertical: 13,

    borderBottomWidth: 1,

    borderBottomColor:
      '#F1F2F4',
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  rowLabelWrap: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    flex: 1,
  },

  label: {
    color: '#777',

    fontSize: 13,

    fontWeight: '500',
  },

  value: {
    flex: 1.4,

    color:
      Mycolors.primarycolor,

    fontSize: 13,

    fontWeight: '600',

    textAlign: 'right',
  },

  /* =========================
     BIO
  ========================= */

  bio: {
    marginTop: 7,

    color: '#555',

    fontSize: 14,

    lineHeight: 21,
  },

  /* =========================
     EDIT BUTTON
  ========================= */

  editButton: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    height: 54,

    marginHorizontal: 16,
    marginTop: 18,

    borderRadius: 14,

    backgroundColor:
      Mycolors.secondarycolor,

    elevation: 3,

    shadowColor:
      Mycolors.primarycolor,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,

    shadowRadius: 6,
  },

  editButtonText: {
    marginHorizontal: 9,

    color:
      Mycolors.primarycolor,

    fontSize: 15,

    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.85,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  /* =========================
     ACCOUNT
  ========================= */

  accountSection: {
    marginHorizontal: 16,
    marginTop: 24,

    padding: 16,

    borderRadius: 16,

    backgroundColor:
      Mycolors.whitecolor,

    borderWidth: 1,

    borderColor: '#ECEEF2',
  },

  accountTitle: {
    marginBottom: 6,

    color: '#999',

    fontSize: 11,

    fontWeight: '800',

    textTransform: 'uppercase',

    letterSpacing: 0.7,
  },

  accountRow: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 12,

    borderBottomWidth: 1,

    borderBottomColor:
      '#F1F2F4',
  },

  accountIcon: {
    width: 38,
    height: 38,

    borderRadius: 11,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      '#F0F2F7',
  },

  logoutIcon: {
    backgroundColor:
      '#FFF0F0',
  },

  accountText: {
    flex: 1,

    marginLeft: 11,
  },

  accountRowTitle: {
    color:
      Mycolors.primarycolor,

    fontSize: 13,

    fontWeight: '700',
  },

  accountRowSubtitle: {
    marginTop: 2,

    color: '#999',

    fontSize: 10,
  },

  logoutText: {
    color:
      Mycolors.redcolor,
  },

  rowPressed: {
    opacity: 0.7,
  },

  /* =========================
     FOOTER
  ========================= */

  version: {
    marginTop: 25,

    color: '#B0B3B8',

    fontSize: 10,

    textAlign: 'center',
  },

  /* =========================
     EMPTY
  ========================= */

  center: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      Mycolors.whitecolor,
  },

  emptyText: {
    marginTop: 10,

    color: '#777',

    fontSize: 15,
  },
});
