import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  addTalentSkill,
  deleteTalentSkill,
  getAvailableSkills,
  getMyTalentSkills,
} from '@/services/talent.service';
import { Mycolors } from '@/constants/mycolors';

interface Skill {
  id: number;
  name: string;
}

interface TalentSkill {
  id: number;
  skill: Skill;
}

export default function ManageSkillsScreen() {
 const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
const [selectedSkills, setSelectedSkills] = useState<TalentSkill[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

 const loadSkills = async () => {
  try {
    setLoading(true);

    const [available, selected] = await Promise.all([
      getAvailableSkills(),
      getMyTalentSkills(),
    ]);

    setAvailableSkills(available);
    setSelectedSkills(selected);
  } catch (error) {
    console.error(
      'Failed to load skills:',
      error,
    );

    Alert.alert(
      'Error',
      'Unable to load skills.',
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadSkills();
  }, []);

  const handleRemoveSkill = async (
    talentSkillId: number,
  ) => {
    try {
      setSaving(talentSkillId);

      await deleteTalentSkill(talentSkillId);

     setSelectedSkills((current) =>
  current.filter(
    (item) => item.id !== talentSkillId,
  ),
);
    } catch (error) {
      console.error(
        'Failed to remove skill:',
        error,
      );

      Alert.alert(
        'Error',
        'Unable to remove this skill.',
      );
    } finally {
      setSaving(null);
    }
  };

  const handleToggleSkill = async (
  skill: Skill,
) => {
  const selected = selectedSkills.find(
    (item) => item.skill.id === skill.id,
  );

  try {
    setSaving(skill.id);

    if (selected) {
      await deleteTalentSkill(selected.id);

      setSelectedSkills((current) =>
        current.filter(
          (item) => item.id !== selected.id,
        ),
      );
    } else {
      const newTalentSkill =
        await addTalentSkill(skill.id);

      setSelectedSkills((current) => [
        ...current,
        newTalentSkill,
      ]);
    }
  } catch (error) {
    console.error(
      'Failed to update skill:',
      error,
    );

    Alert.alert(
      'Error',
      'Unable to update this skill.',
    );
  } finally {
    setSaving(null);
  }
};

  const filteredSkills = availableSkills.filter(
  (skill) =>
    skill.name
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={Mycolors.secondarycolor}
        />

        <Text style={styles.loadingText}>
          Loading your skills...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Manage Skills
      </Text>

      <Text style={styles.description}>
        Add skills that describe your talent and
        remove skills you no longer offer.
      </Text>

      <Text style={styles.sectionTitle}>
        Your Skills
      </Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search available skills..."
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
      />

     {filteredSkills.length === 0 ? (
  <View style={styles.empty}>
    <Text style={styles.emptyTitle}>
      No skills found
    </Text>

    <Text style={styles.emptyText}>
      Try a different search.
    </Text>
  </View>
) : (
  <FlatList
    data={filteredSkills}
    keyExtractor={(item) =>
      String(item.id)
    }
    contentContainerStyle={
      styles.listContent
    }
    renderItem={({ item }) => {
      const selected = selectedSkills.some(
        (selectedSkill) =>
          selectedSkill.skill.id === item.id,
      );

      return (
        <Pressable
          onPress={() =>
            handleToggleSkill(item)
          }
          disabled={saving === item.id}
          style={[
            styles.skillRow,
            selected && styles.skillRowSelected,
          ]}
        >
          <Text style={styles.skillName}>
            {item.name}
          </Text>

          {saving === item.id ? (
            <ActivityIndicator
              size="small"
              color={Mycolors.secondarycolor}
            />
          ) : (
            <Text
              style={[
                styles.selectText,
                selected &&
                  styles.selectTextSelected,
              ]}
            >
              {selected ? '✓ Selected' : '+ Add'}
            </Text>
          )}
        </Pressable>
      );
    }}
  />
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },

  listContent: {
    paddingTop: 14,
    paddingBottom: 30,
  },

  skillRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  skillName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  removeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },

  empty: {
    marginTop: 24,
    padding: 24,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  skillRowSelected: {
  backgroundColor: '#F0FDF4',
  borderColor: '#BBF7D0',
},

selectText: {
  fontSize: 13,
  fontWeight: '700',
  color: Mycolors.secondarycolor,
},

selectTextSelected: {
  color: '#16A34A',
},
});
