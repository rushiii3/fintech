import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
type RoundedButtonProps = {
  text: string;
  icon: typeof Ionicons.defaultProps;
  onPress: () => void;
};
const RoundedButton = ({ text, icon, onPress }: RoundedButtonProps) => {
  return (
    <TouchableOpacity style={style.container} onPress={onPress}>
      <View style={style.circle}>
        <Ionicons name={icon} size={30} />
      </View>
      <View>
        <Text style={style.label}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};
const style = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 10,
  },
  circle:{
    height:50,
    width:50,
    borderRadius:30,
    backgroundColor:Colors.lightGray,
    justifyContent:'center',
    alignItems:'center'
  },
  label:{
    fontSize:12,
    fontWeight:'500',
    color:Colors.dark,
  }
});
export default RoundedButton;
