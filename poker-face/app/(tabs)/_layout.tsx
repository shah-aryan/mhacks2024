import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import GameplayScreen from "./Gameplay"
import MetricsScreen from "./Metric"
import HomeScreen from "./Home"
import { Ionicons, FontAwesome6, Entypo } from "@expo/vector-icons";
import { Colors } from '@/constants/Colors';
const Tab = createMaterialBottomTabNavigator();

const AppNavigator = () => {
  return (
    // <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Navigation"
        sceneAnimationEnabled="true"
        activeColor={Colors.tabcolor}
        inactiveColor={Colors.inactiveColor}
        barStyle={{ backgroundColor: `${Colors.themecolor}`, bottomPadding: 10 }}
        shifting={true}
      >
        <Tab.Screen
          name="Dashboard"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="calculator"
                size={26}
                color={focused ? Colors.tabcolor : Colors.inactiveColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Gameplay"
          component={GameplayScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="back-in-time"
                size={26}
                color={focused ? Colors.tabcolor : Colors.inactiveColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Metrics"
          component={MetricsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome6
                name="money-bill-trend-up"
                size={25}
                color={focused ? Colors.tabcolor : Colors.inactiveColor}
              />
            ),
          }}
        />
      </Tab.Navigator>
    // </NavigationContainer>
  );
};

export default AppNavigator;