import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'QR 출퇴근' }} />
        <Stack.Screen name="login" options={{ title: '로그인' }} />
        <Stack.Screen name="history" options={{ title: '근태 기록' }} />
      </Stack>
    </AuthProvider>
  );
}

