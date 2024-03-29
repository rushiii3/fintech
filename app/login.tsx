import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
enum SignType  {
  Phone,Email, Google, Apple
};
const Login = () => {
  const [ContryCode, setContryCode] = useState("+91");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const KeyBoardVerticalOffSet = Platform.OS ? 80 : 40;
  const {signIn} = useSignIn();
  const router = useRouter();
  const onSubmit = async(type:SignType) => {
    console.log(SignType.Phone);
    
  }
  const Submit = async (type:SignType) => {
    if (SignType.Phone) {
      console.log("in phonee");
      
      try {
        const fullphonenumber = `${ContryCode}${PhoneNumber}`;
        // const {supportedFirstFactors} = await signIn!.create({identifier:fullphonenumber,}); 
        // const firstPhoneFactor:any = supportedFirstFactors.find((factor:any)=>{
        //   return factor.strategy==='phone_code';
        // });
        // const {phoneNumberId} = firstPhoneFactor;
        // await signIn!.prepareFirstFactor({
        //   strategy:'phone_code',
        //   phoneNumberId
        // });
        router.push({pathname :'/verify/[phone]',params:{phone:fullphonenumber,signin:'true'}})

      } catch (error) {
        if (isClerkAPIResponseError(error)) {
          if (error.errors[0].code==='form_identifier_not_found') {
            Alert.alert('Error',error.errors[0].message);
          }
        }
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={KeyBoardVerticalOffSet}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you confirmation code there.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={ContryCode}
            style={styles.input}
            placeholder="Contry Code"
            placeholderTextColor={Colors.gray}
          />
          <TextInput
            value={PhoneNumber}
            onChangeText={setPhoneNumber}
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile Number"
            keyboardType="numeric"
            placeholderTextColor={Colors.gray}
          />
        </View>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            PhoneNumber !== "" ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={()=>{onSubmit(SignType.Phone)}}
        >
          <Text style={defaultStyles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{ flex: 1, height: 1, backgroundColor: Colors.lightGray }}
          />
          <Text>or</Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: Colors.lightGray }}
          />
        </View>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: "white",
            },
          ]}
          onPress={()=>{Submit(SignType.Email)}}

        >
          <Ionicons name="mail" size={34} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: "white",
            },
          ]}
          onPress={()=>{Submit(SignType.Google)}}

        >
          <Ionicons name="logo-google" size={34} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              marginTop: 20,
              backgroundColor: "white",
            },
          ]}
          onPress={()=>{Submit(SignType.Apple)}}

        >
          <Ionicons name="logo-apple" size={34} color={Colors.dark} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginVertical: 40,
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});
export default Login;
