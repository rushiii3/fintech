import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const CustomHeader = () => {
  const { top } = useSafeAreaInsets();
  return (
    <BlurView intensity={80} tint="extraLight" style={{ paddingTop: top }}>
      <View style={[style.container]}>
        <TouchableOpacity style={[style.roundedBtn]}>
          <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>SG</Text>
        </TouchableOpacity>
        <View style={style.serachSection}>
            <Ionicons style={style.icon} name="search"  size={20} color={Colors.dark} />
            <TextInput style={style.input} placeholder="Search" placeholderTextColor={Colors.gray} />
        </View>
        <View style={style.circle}>
        <Ionicons name="stats-chart" size={20} />
      </View>
      <View style={style.circle}>
        <Ionicons name="stats-chart" size={20} />
      </View>
      </View>
    </BlurView>
  );
};
const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    backgroundColor: "transparent",
    gap: 10,
    paddingHorizontal:20
  },
  roundedBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor:Colors.gray,
    justifyContent:'center',
    alignItems:'center'
  },
  serachSection:{
    flex:1,
    flexDirection:'row',
    backgroundColor:Colors.lightGray,
    borderRadius:30,
    alignItems:'center',
    justifyContent:'center'
  },
  input:{
    flex:1,
    paddingLeft:0,
    paddingRight:10,
    paddingTop:10,
    paddingBottom:10
  },
  icon:{
    padding:10
  },
  
  circle:{
    height:40,
    width:40,
    borderRadius:30,
    backgroundColor:Colors.lightGray,
    justifyContent:'center',
    alignItems:'center'
  },
});
export default CustomHeader;
