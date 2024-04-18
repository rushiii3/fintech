import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getAppIcon, setAppIcon } from 'expo-dynamic-app-icon';

const ICONS = [
  {
    name: 'Default',
    icon: require('@/assets/images/icon.png'),
  },
  {
    name: 'Dark',
    icon: require('@/assets/images/icon-dark.png'),
  },
  {
    name: 'Vivid',
    icon: require('@/assets/images/icon-vivid.png'),
  },
];
const Page = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [firstname, setfirstname] = useState("Hrushikesh");
  const [lastname, setlastname] = useState("Shinde");
  const [edit, setedit] = useState(false);
  const [activeIcon, setActiveIcon] = useState('Default');
  useEffect(() => {
    const loadCurrentIconPref = async () => {
      const icon = await getAppIcon();
      console.log('🚀 ~ loadCurrentIconPref ~ icon:', icon);
      setActiveIcon(icon);
    };
    loadCurrentIconPref();
  }, []);

  const onUsersave = async () => {
    try {
      await user?.update({ firstName: firstname, lastName: lastname });
      setedit(false);
    } catch (error) {
      console.log(error);
    } finally {
      setedit(false);
    }
  };
  const onCaptureImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.75,
        base64: true,
      });

      if (!result.canceled) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        console.log(base64);

        user?.setProfileImage({
          file: base64,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeAppIcon = async (icon: string) => {
    console.log(getAppIcon);
    await setAppIcon(icon.toLowerCase());
    console.log(icon.toLocaleLowerCase());
    
    setActiveIcon(icon);
  };
  return (
    <BlurView
      intensity={80}
      tint="dark"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", flex: 1 }}
    >
      <SafeAreaView>
        {user && (
          <>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={onCaptureImage}
                style={style.captureBtn}
              >
                {user?.imageUrl && (
                  <Image
                    source={{ uri: user?.imageUrl }}
                    style={style.avatar}
                  />
                )}
              </TouchableOpacity>

              {!edit && (
                <View style={style.rowedit}>
                  <Text style={{ color: "white", fontSize: 26 }}>
                    {firstname}
                  </Text>
                  <Text style={{ color: "white", fontSize: 26 }}>
                    {lastname}
                  </Text>
                  <TouchableOpacity onPress={() => setedit(true)}>
                    <Ionicons
                      name="ellipsis-horizontal"
                      color={"white"}
                      size={26}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {edit && (
                <View style={style.rowedit}>
                  <TextInput
                    placeholder="First Name"
                    value={firstname || ""}
                    onChangeText={setfirstname}
                    style={[style.InputField]}
                  />
                  <TextInput
                    placeholder="Last Name"
                    value={lastname || ""}
                    onChangeText={setlastname}
                    style={[style.InputField]}
                  />
                  <TouchableOpacity onPress={onUsersave}>
                    <Ionicons
                      name="checkmark-outline"
                      color={"white"}
                      size={26}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={style.actions}>
              <TouchableOpacity style={style.btn} onPress={() => signOut()}>
                <Ionicons name="log-out" size={24} color={"#fff"} />
                <Text style={{ color: "#fff", fontSize: 18 }}>Log out</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.btn}>
                <Ionicons name="person" size={24} color={"#fff"} />
                <Text style={{ color: "#fff", fontSize: 18 }}>Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.btn}>
                <Ionicons name="bulb" size={24} color={"#fff"} />
                <Text style={{ color: "#fff", fontSize: 18 }}>Learn</Text>
              </TouchableOpacity>
              <TouchableOpacity style={style.btn}>
                <Ionicons name="megaphone" size={24} color={"#fff"} />
                <Text style={{ color: "#fff", fontSize: 18, flex: 1 }}>
                  Inbox
                </Text>
                <View
                  style={{
                    backgroundColor: Colors.primary,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>14</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={style.actions}>
        {ICONS.map((icon) => (
          <TouchableOpacity
            key={icon.name}
            style={style.btn}
            onPress={() => onChangeAppIcon(icon.name)}>
            <Image source={icon.icon} style={{ width: 24, height: 24 }} />
            <Text style={{ color: '#fff', fontSize: 18 }}>{icon.name}</Text>
            {activeIcon.toLowerCase() === icon.name.toLowerCase() && (
              <Ionicons name="checkmark" size={24} color={'#fff'} />
            )}
          </TouchableOpacity>
        ))}
      </View>
          </>
        )}
      </SafeAreaView>
    </BlurView>
  );
};
const style = StyleSheet.create({
  rowedit: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  captureBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray,
  },
  InputField: {
    width: 140,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
  },
  actions: {
    backgroundColor: "rgba(256, 256, 256, 0.1)",
    borderRadius: 16,
    gap: 0,
    margin: 20,
  },
  btn: {
    padding: 14,
    flexDirection: "row",
    gap: 20,
  },
});
export default Page;
