import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen() {
  const { me, users, fetchUsers } = useUser();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome, {me ? `${me.firstName} ${me.lastName}` : '...'}!
      </Text>

      <TouchableOpacity style={styles.button} onPress={fetchUsers}>
        <Text style={styles.buttonText}>Fetch Users</Text>
      </TouchableOpacity>

      {users.map((user) => (
        <Text key={user.id} style={styles.userItem}>
          {user.firstName} — {user.email}
        </Text>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#e53e3e',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userItem: {
    fontSize: 14,
    paddingVertical: 4,
    color: '#333',
  },
});