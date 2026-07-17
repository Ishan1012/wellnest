import { View, Text } from 'react-native'
import React from 'react'

export default function TipsScreen({ route }) {
  const { tipId } = route.params;
  return (
    <View>
      <Text>TipsScreen {tipId}</Text>
    </View>
  )
}