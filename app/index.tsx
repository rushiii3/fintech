import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useAssets } from "expo-asset";
import { ResizeMode, Video } from "expo-av";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";

const Page = () => {
  const [assets] = useAssets([require("../assets/videos/intro.mp4")]);
  return (
    <View style={styles.container}>
      {assets && (
        <Video
          resizeMode={ResizeMode.COVER}
          isMuted
          isLooping
          shouldPlay
          source={{ uri: assets[0].uri }}
          style={styles.video}
        />
      )}
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>Ready to change the way you money</Text>
      </View>

      <View style={styles.buttons}>
        <Link href={"/login"} asChild 
        style={{ flex:1,
            backgroundColor:'#333333',
            padding:15,
            borderRadius:20,
            textAlign:'center',
            alignItems:'center'}}>
            <TouchableOpacity>
                <Text style={{color:'white',fontSize:22, fontWeight:'500'}}>Log in</Text>
            </TouchableOpacity>
        </Link>
        <Link href={"/signup"} asChild 
        style={{ flex:1,
            backgroundColor:'#fff',
            padding:15,
            borderRadius:20,
            textAlign:'center',
            alignItems:'center'}}>
            <TouchableOpacity>
                <Text style={{color:'black',fontSize:22, fontWeight:'500'}}>Sign up</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  header: {
    textTransform: "capitalize",
    fontSize: 36,
    color: "white",
    fontWeight: "900",
  },
  buttons:{
    flexDirection:'row',
    justifyContent:'center',
    marginBottom:60,
    gap:20,
    paddingHorizontal:20
  },
  links:{
    flex:1,
    backgroundColor:'#333333',
    padding:15,
    borderRadius:20,
    textAlign:'center',
    alignItems:'center'
  }
});
export default Page;
