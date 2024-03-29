import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { useSignUp } from '@clerk/clerk-expo';

const Signup = () => {
  const [ContryCode, setContryCode] = useState("+91");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const KeyBoardVerticalOffSet = Platform.OS?80:40;
  const router = useRouter();
  const {signUp} = useSignUp();
  const Submit = async() => {
    const fullphonenumber = `${ContryCode}${PhoneNumber}`;
    try {
      await signUp!.create({
        phoneNumber:fullphonenumber
      });
      signUp!.preparePhoneNumberVerification();
      router.push({pathname :'/verify/[phone]',params:{phone:fullphonenumber}})
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior="padding" keyboardVerticalOffset={KeyBoardVerticalOffSet}>
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
        <Link href={"/login"} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have any account?
            </Text>
          </TouchableOpacity>
        </Link>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            PhoneNumber !== '' ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={Submit}
        >
          <Text style={defaultStyles.buttonText}>Submit</Text>
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
export default Signup;
