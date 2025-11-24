declare module 'react-native-vector-icons/Feather' {
  import { ComponentType } from 'react';
    import { TextProps } from 'react-native';
  const Feather: ComponentType<TextProps & { name: string; size?: number; color?: string }>;
  export default Feather;
}
