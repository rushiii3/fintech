import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Currency } from "../../../interfaces/crypto";
import { useHeaderHeight } from "@react-navigation/elements";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
const CryptoPage = () => {
  const headerHeight = useHeaderHeight();
  const currencies = useQuery({
    queryKey: ["listings"],
    queryFn: () => fetch("/api/listing").then((res) => res.json()),
  });
  const ids = currencies?.data
    ?.map((currency: Currency) => currency.id)
    .join(",");
  console.log(ids);
  const { data } = useQuery({
    queryKey: ["info", ids],
    queryFn: () => fetch(`/api/info?ids=${ids}`).then((res) => res.json()),
    enabled: !!ids,
  });
  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight }}
    >
      <Text style={defaultStyles.sectionHeader}>Latest Crypto</Text>
      <View style={defaultStyles.block}>
        {currencies?.data?.map((currency: Currency) => (
          <Link href={`/crpyto/${currency.id}`} key={currency.id} asChild>
            <TouchableOpacity
              style={{ flexDirection: "row", gap: 14, alignItems: "center" }}
            >
              <Image
                source={{ uri: data?.[currency.id].logo }}
                style={{ height: 40, width: 40 }}
              />
              <View style={{ flex: 1, gap: 5 }}>
                <Text
                  style={{
                    fontWeight: "600",
                    color: Colors.dark,
                    fontSize: 16,
                  }}
                >
                  {currency.name}
                </Text>
                <Text style={{ color: Colors.gray, fontSize: 12 }}>
                  {currency.symbol}
                </Text>
              </View>
              <View style={{gap:6,alignItems:'flex-end'}}>
                <Text style={{fontWeight:'600'}}>{currency.quote.EUR.price.toFixed(2)} €</Text>
                <View style={{flexDirection:'row', gap:4}}>
                <Ionicons
                  name={
                    currency.quote.EUR.percent_change_1h > 0
                      ? "caret-up"
                      : "caret-down"
                  }
                  size={15}
                  color={
                    currency.quote.EUR.percent_change_1h > 0 ? "green" : "red"
                  }
                />
                <Text
                  style={{
                    fontSize:13,
                    color:
                      currency.quote.EUR.percent_change_1h > 0
                        ? "green"
                        : "red",
                  }}
                >
                  {currency.quote.EUR.percent_change_1h.toFixed(2)} %
                </Text>
                </View>
                
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};

export default CryptoPage;
