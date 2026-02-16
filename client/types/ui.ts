import type { TextInputProps, StyleProp, TextStyle, ViewStyle } from "react-native";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;

  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}