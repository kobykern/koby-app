import React, { useState, JSX } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { logout, fetchWithAuth } from '../utils/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props): JSX.Element {
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  const handleFetchUsers = async () => {
    try {
      setStatus('Fetching...');
      const response = await fetchWithAuth('/api/users');
      const data = await response.json();
      setUsers(data);
      setStatus(`Fetched ${data.length} user(s) ✅`);
    } catch (error: any) {
      if (error.message === 'SESSION_EXPIRED') {
        setStatus('Session expired — redirecting to login');
        navigation.replace('Login');
        return;
      }
      setStatus('Error fetching users ❌');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>You are logged in.</Text>

      <View style={styles.buttonRow}>
        <Button title="Fetch Users" onPress={handleFetchUsers} />
      </View>

      <Text style={styles.status}>{status}</Text>

      {users.map((user) => (
        <Text key={user.id} style={styles.user}>
          {user.name} — {user.email}
        </Text>
      ))}

      <View style={styles.buttonRow}>
        <Button title="Logout" onPress={handleLogout} color="#e53e3e" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  buttonRow: {
    marginVertical: 12,
    width: '100%',
  },
  status: {
    fontSize: 14,
    color: '#333',
    marginVertical: 8,
  },
  user: {
    fontSize: 14,
    color: '#444',
    paddingVertical: 4,
  },
});
