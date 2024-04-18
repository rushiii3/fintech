import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import * as haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Offset } from "@shopify/react-native-skia";

const Page = () => {
  const { user } = useUser();
  const [firstname, setfirstname] = useState(user?.firstName);
  const [code, setcode] = useState<Number[]>([]);
  const codeLength = Array(6).fill(0);
  const router = useRouter();
  const offset = useSharedValue(0);
  const animateStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX:offset.value}]
    }
  })
  useEffect(() => {
    if (code.length === 6) {
      if (code.join("") === "111111") {
        router.replace("/(authenticated)/(tabs)/home");
        console.log(code);
      } else {
        offset.value = withSequence(
          withTiming(-20,{duration:80/2}),
          withRepeat(withTiming(20,{duration:80}),4,true),
          withTiming(0,{duration:80/2}),


        );
        haptics.notificationAsync(haptics.NotificationFeedbackType.Error);
        setcode([]);
      }
    }
  }, [code]);
  const onPressNumber = (number: Number) => {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    setcode([...code, number]);
  };
  const onBackPress = () => {
    setcode(code.slice(0, -1));
  };

  const onBiometricsAuthPress = async () => {
    const { success } = await LocalAuthentication.authenticateAsync();
    if (success) {
      router.replace("/(authenticated)/(tabs)/home");
    } else {
      haptics.notificationAsync(haptics.NotificationFeedbackType.Error);
    }
  };
  return (
    <SafeAreaView>
      <Text style={style.greeting}>Welcome back, {firstname}</Text>
      <Animated.View style={[style.codeView, animateStyle]}>
        {codeLength.map((value, key) => (
          <View
            key={key}
            style={[
              style.codeEmpty,
              {
                backgroundColor: code[key] ? Colors.primary : Colors.lightGray,
              },
            ]}
          ></View>
        ))}
      </Animated.View>
      <View style={[style.NumberView]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[1, 2, 3].map((value, key) => (
            <TouchableOpacity
              key={value}
              onPress={() => {
                onPressNumber(value);
              }}
            >
              <Text style={{ fontSize: 32 }}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[4, 5, 6].map((value, key) => (
            <TouchableOpacity
              key={value}
              onPress={() => {
                onPressNumber(value);
              }}
            >
              <Text style={{ fontSize: 32 }}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {[7, 8, 9].map((value, key) => (
            <TouchableOpacity
              key={value}
              onPress={() => {
                onPressNumber(value);
              }}
            >
              <Text style={{ fontSize: 32 }}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={onBiometricsAuthPress}>
            <MaterialCommunityIcons name="face-recognition" size={32} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onPressNumber(0);
            }}
          >
            <Text style={{ fontSize: 32 }}>0</Text>
          </TouchableOpacity>
          <View style={{ width: 30 }}>
            {code.length > 0 && (
              <TouchableOpacity onPress={onBackPress}>
                <MaterialCommunityIcons name="backspace-outline" size={32} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    alignSelf: "center",
  },
  codeView: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginVertical: 60,
    alignItems: "center",
  },
  codeEmpty: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  NumberView: {
    marginHorizontal: 80,
    gap: 60,
  },
});
export default Page;
