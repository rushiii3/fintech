
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Link, Stack, router, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";
// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitalLayout = () => {
  const router = useRouter();
  const {isLoaded, isSignedIn} = useAuth();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    console.log(isSignedIn);
  }, [isSignedIn]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="signup"
          options={{
            title: "",
            headerBackTitle: "",
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" size={34} color={Colors.dark} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: "",
            headerBackTitle: "",
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" size={34} color={Colors.dark} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <Link href={"/helper"} asChild>
                <TouchableOpacity>
                  <Ionicons
                    name="help-circle-outline"
                    size={34}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name="helper"
          options={{ title: "Help", presentation: "modal" }}
        />
        <Stack.Screen
          name="verify/[phone]"
          options={{
            title: "",
            headerBackTitle: "",
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" size={34} color={Colors.dark} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <Link href={"/helper"} asChild>
                <TouchableOpacity>
                  <Ionicons
                    name="help-circle-outline"
                    size={34}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
      </Stack>
  );
}

const RootLayoutNav = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <InitalLayout />
    </ClerkProvider>
    
  );
}
export default RootLayoutNav;
