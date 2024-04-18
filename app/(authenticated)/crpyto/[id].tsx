import {
  View,
  Text,
  SafeAreaView,
  SectionList,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
const categories = ["Overview", "News", "Orders", "Transactions"];
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedProps } from "react-native-reanimated";

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}
const CryptoPage = () => {
  const [Active, setActive] = useState(0);
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });
  const font = useFont(require("../../../assets/fonts/SpaceMono-Regular.ttf"));
  const { data } = useQuery({
    queryKey: ["info", id],
    queryFn: async () => {
      const response = await fetch(`/api/info?ids=${id}`);
      const info = await response.json();
      const data = info[+id];
      return data;
    },
  });
  const animatedText = useAnimatedProps(() => {
    return {
      text:`${state.y.price.value.value.toFixed(2)}`,
      defaultValue : ''
    }
  })
  const animateDate = useAnimatedProps(()=>{
    const date = new Date(state.x.value.value);
    return {
      text:`${date.toLocaleDateString()}`,
      defaultValue : ''
    }
  })
  const { data: ticker } = useQuery({
    queryKey: ["ticker"],
    queryFn: async (): Promise<any[]> =>
      fetch(`/api/ticker`).then((res) => res.json()),
  });

  useEffect(() => {
    console.log(isActive);
    if (isActive) {
      Haptics.selectionAsync();
    }
  }, [isActive]);

  return (
    <>
      <Stack.Screen options={{ title: data?.name }} />

      <SectionList
        contentInsetAdjustmentBehavior="automatic"
        style={{ marginTop: headerHeight }}
        sections={[{ data: [{ title: "Chart" }] }]}
        renderSectionHeader={() => (
          <>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                width: "100%",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                alignItems: "center",
                paddingBottom: 8,
                backgroundColor: Colors.background,
                borderBottomColor: Colors.lightGray,
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            >
              {categories.map((category, key) => (
                <TouchableOpacity
                  onPress={() => {
                    setActive(key);
                  }}
                  key={key}
                  style={
                    Active === key
                      ? style.categoriesBtnActive
                      : style.categoriesBtn
                  }
                >
                  <Text
                    style={
                      Active === key
                        ? style.categoryTextActive
                        : style.categoryText
                    }
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={style.subtitle}>{data?.symbol}</Text>

              <Image
                source={{ uri: data?.logo }}
                style={{ height: 60, width: 60 }}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 10, margin: 12 }}>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    flexDirection: "row",
                    gap: 16,
                    backgroundColor: Colors.primary,
                  },
                ]}
              >
                <Ionicons name="add" size={24} color={"#fff"} />
                <Text style={[defaultStyles.buttonText, { color: "#fff" }]}>
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  {
                    flexDirection: "row",
                    gap: 16,
                    backgroundColor: Colors.primaryMuted,
                  },
                ]}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text
                  style={[defaultStyles.buttonText, { color: Colors.primary }]}
                >
                  Recieve
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        keyExtractor={(i) => i.title}
        renderItem={({ item }) => (
          <>
            <View style={[defaultStyles.block, { height: 500 }]}>
              {ticker && (
                <>
                  {!isActive && (
                    <View>
                      <Text
                        style={{
                          fontSize: 30,
                          fontWeight: "bold",
                          color: Colors.dark,
                        }}
                      >
                        {ticker[ticker.length - 1].price.toFixed(2)}€
                      </Text>
                      <Text style={{ fontSize: 18, color: Colors.gray }}>
                        Today
                      </Text>
                    </View>
                  )}
                  {isActive && (
                    <View>
                      <AnimatedTextInput
                        editable={false}
                        underlineColorAndroid={"transparent"}
                        style={{
                          fontSize: 30,
                          fontWeight: "bold",
                          color: Colors.dark,
                        }}
                        animatedProps={animatedText}
                      >
                        
                      </AnimatedTextInput>
                      <AnimatedTextInput
                        editable={false}
                        underlineColorAndroid={"transparent"}
                        style={{ fontSize: 18, color: Colors.gray }}
                        animatedProps={animateDate}
                      >
                        
                      </AnimatedTextInput>
                    </View>
                  )}

                  <CartesianChart
                    chartPressState={state}
                    axisOptions={{
                      font,
                      tickCount: 5,
                      labelOffset: { x: -2, y: 0 },
                      labelColor: Colors.gray,
                      formatYLabel: (v) => `${v}€`,
                      formatXLabel: (ms) => format(new Date(ms), "MM/yy"),
                    }}
                    data={ticker!}
                    xKey="timestamp"
                    yKeys={["price"]}
                  >
                    {/* 👇 render function exposes various data, such as points. */}
                    {({ points }) => (
                      // 👇 and we'll use the Line component to render a line path.
                      <>
                        <Line
                          points={points.price}
                          color={Colors.primary}
                          strokeWidth={3}
                        />
                        {isActive && (
                          <ToolTip
                            x={state.x.position}
                            y={state.y.price.position}
                          />
                        )}
                      </>
                    )}
                  </CartesianChart>
                </>
              )}
            </View>
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={style.subtitle}>Overview</Text>
              <Text style={{ color: Colors.gray }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Adipisci placeat explicabo culpa nam provident, impedit ipsum
                dolore temporibus repudiandae quaerat veniam officia. Architecto
                ex, quo unde aliquid exercitationem vero consequuntur!
              </Text>
            </View>
          </>
        )}
      ></SectionList>
    </>
  );
};
const style = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    color: Colors.gray,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: "#000",
  },
  categoriesBtn: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    paddingHorizontal: 14,

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});
export default CryptoPage;
