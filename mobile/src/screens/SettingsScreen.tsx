import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../navigation/AuthContext';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* User info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email ?? '—'}</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b1e',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#25262b',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#373a40',
  },
  label: {
    color: '#868e96',
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 15,
  },
  logoutBtn: {
    backgroundColor: '#e03131',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
