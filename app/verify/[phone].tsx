import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { defaultStyles } from '@/constants/Styles';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';
import Colors from '@/constants/Colors';
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
const PhoneVerify = () => {
    const {phone,signin} = useLocalSearchParams<{phone:string,signin:string}>();
    const [code, setcode] = useState('');
    const {signIn} = useSignIn();
    const {signUp , setActive} = useSignUp();
    useEffect(() => {
        if (code.length===6) {
            console.log(code);
            if (signin==='true') {
                verifySign()
            }else{
                verifyCode()
            }
        }
     
    }, [code])
    const  verifySign = async() => {
        try {
            await signIn!.attemptFirstFactor({
                strategy:'phone_code',
                code
            });
            await setActive!({session:signIn!.createdSessionId})
        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                Alert.alert(error.errors[0].message);
            }
        }
    };
    const verifyCode = async() => {
        try {
            await signUp!.attemptPhoneNumberVerification({
                code
            });
            await setActive!({session:signUp!.createdSessionId})
        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                Alert.alert(error.errors[0].message);
            }
        }
    };
    const CELL_COUNT = 6;
    const ref = useBlurOnFulfill({value:code, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value:code,
    setValue:setcode,
  });

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digit code</Text>
        <Text style={defaultStyles.descriptionText}>
          Code send to {phone} unless already have and account.
        </Text>
        <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={code}
        onChangeText={setcode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        testID="my-code-input"
        renderCell={({index, symbol, isFocused}) => (
            
            <Fragment key={index}>
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}>
              <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
            </View>
            {index === 2 ? <View key={`separator-${index}`} style={styles.separator} /> : null}
          </Fragment>
        )}
      />
        <Link href={"/login"} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have any account?
            </Text>
          </TouchableOpacity>
        </Link>
    </View>
  )
}
const styles = StyleSheet.create({
    codeFieldRoot: {
      marginVertical: 20,
      marginLeft: 'auto',
      marginRight: 'auto',
      gap: 12,
    },
    cellRoot: {
      width: 45,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.lightGray,
      borderRadius: 8,
    },
    cellText: {
      color: '#000',
      fontSize: 36,
      textAlign: 'center',
    },
    focusCell: {
      paddingBottom: 8,
    },
    separator: {
      height: 2,
      width: 10,
      backgroundColor: Colors.gray,
      alignSelf: 'center',
    },
  });
  
export default PhoneVerify