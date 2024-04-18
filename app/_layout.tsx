import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Link, Stack, router, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserInactivityProvider } from "@/context/UserInactivity";
const queryClient = new QueryClient();

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
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
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
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === "(authenticated)";
    if (isSignedIn && !inAuthGroup) {
      router.replace("/(authenticated)/(tabs)/crypto");
      
    } else if (!isSignedIn) {
      router.replace("/login");
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !isLoaded) {
    return <Text>Loading...</Text>;
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
      <Stack.Screen
        name="(authenticated)/(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/crpyto/[id]"
        options={{
          title: "",

          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity onPress={router.back}>
                <Ionicons
                  name="notifications-outline"
                  size={34}
                  color={Colors.dark}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="star-outline" size={34} color={Colors.dark} />
              </TouchableOpacity>
            </View>
          ),
          headerTransparent: true,
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="(authenticated)/(modals)/lock"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="(authenticated)/(modals)/account"
        options={{  animation:"fade", presentation:'transparentModal', headerTransparent:true, title:'', 
        headerLeft:() =>( 
          <TouchableOpacity onPress={router.back}>
                <Ionicons name="close-outline" size={34} color={'#fff'} />
              </TouchableOpacity>
        ), }}
      />
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <UserInactivityProvider>
          <InitalLayout />
        </UserInactivityProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};
export default RootLayoutNav;
