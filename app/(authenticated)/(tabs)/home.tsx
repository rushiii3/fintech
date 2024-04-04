import { View, Text, ScrollView, StyleSheet, Button } from "react-native";
import React from "react";
import Colors from "../../../constants/Colors";
import RoundedButton from "../../../component/RoundedButton";
import Dropdown from "../../../component/Dropdown";
import { useBalanceStore } from "../../../store/balanceStorage";
import { defaultStyles } from "../../../constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import Widgetlist from '../../../component/SortableList/Widgetlist';
import { useHeaderHeight } from '@react-navigation/elements';

const Home = () => {
  const headerHeight = useHeaderHeight();
  const { transactions, runTransaction, balance, clearTransactions } =
    useBalanceStore();
  console.log(balance);
  const onAddmoney = async () => {
    console.log("hehe");
    runTransaction({
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
      title: "Added money",
    });
  };
  return (

    <ScrollView style={{ backgroundColor: Colors.background, paddingTop:headerHeight }}>
      <View style={style.account}>
        <View style={style.row}>
          <Text style={style.currency}>₹</Text>
          <Text style={style.balance}>{balance()}</Text>
        </View>
      </View>
      <View style={style.actionRow}>
        <RoundedButton icon={"add"} text={"Add money"} onPress={onAddmoney} />
        <RoundedButton
          icon={"refresh"}
          text={"Exchange"}
          onPress={clearTransactions}
        />
        <RoundedButton icon={"list"} text={"Details"} onPress={onAddmoney} />
        <RoundedButton icon={"add"} text={"Add money"} onPress={onAddmoney} />
        <Dropdown />
      </View>
      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={style.transactions}>
        {transactions.length === 0 ? (
          <Text style={{ padding: 14, color: Colors.gray }}>
            No Transactions yet!
          </Text>
        ) : (
          transactions.map((transaction) => (
            <View
              key={transaction.id}
              style={{ flexDirection: "row", gap: 16, alignItems: "center" }}
            >
              <View style={style.circle}>
                <Ionicons
                  name={transaction.amount > 0 ? "add" : "remove"}
                  size={25}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{fontWeight:'500'}}>{transaction.title}</Text>
                <Text style={{fontSize:12,color:Colors.gray}}>{transaction.date.toLocaleString()}</Text>
              </View>
              <View>
                <Text>₹{transaction.amount}</Text>
              </View>
            </View>
          ))
        )}
      </View>
     
    </ScrollView>
  );
};
const style = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 7,
  },
  balance: {
    fontSize: 30,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 20,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  transactions: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Home;
