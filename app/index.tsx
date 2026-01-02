import { Redirect } from 'expo-router';

export default function Index() {
  // Use the built-in Redirect which waits for root layout to mount
  return <Redirect href="/login" />;
}
