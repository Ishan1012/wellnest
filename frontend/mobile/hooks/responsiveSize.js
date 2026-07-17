import { PixelRatio } from "react-native";

const fontScale = PixelRatio.getFontScale();

export default function responsiveSize(size) {
    return size/fontScale;
}