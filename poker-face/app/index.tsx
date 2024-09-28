import { Redirect } from 'expo-router'
// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index'
}

const StartScreen = () => {
  return (
    <>
      <Redirect href="/(tabs)" />
    </>
  )
}

export default StartScreen
