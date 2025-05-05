/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { use, useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

interface DayModel {
  day: string;
  start: Date;
  end: Date;
  isOpen: boolean;
  slots: string;
}

class TimeSlotsGenerator {

  static generateTimeSlots(start: Date, end: Date, interval: number): string[] {
    const timeSlots: string[] = [];
    const currentTime = new Date(start);

  
    while (currentTime <= end) {
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      if(`${hours}:${minutes}` !== '08:00') {
        timeSlots.push(`${hours}:${minutes}`);
      }
      
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }

    return timeSlots;
  }

}



function App(): React.JSX.Element {

  const [dayModels, setDayModels] = React.useState<DayModel[]>([]);

  useEffect(() =>  {
    fetch('https://sbtest2.myvtd.site/api/sample').then(async (response)  => {
      if (response.ok) { 
        const data = await response.json();
    
        const days = data.map((item: any)=> {
          const startDate = new Date(item.start_at);
          const endDate = new Date(item.end_at);

          const dayModel: DayModel = {
            day: item.day,
            start: startDate,
            end: endDate,
            isOpen: item.is_open,
            slots: TimeSlotsGenerator.generateTimeSlots(startDate, endDate, 30).join(","),
          };
          return dayModel;
        });
        
        setDayModels(days);
      }
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });  
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Section title="Day Models">
          {dayModels.filter((day: DayModel)=> day.isOpen).map((dayModel: DayModel, index: number) => (
            <Text key={index} style={styles.sectionDescription}>
              {dayModel.day}: {dayModel.start.toDateString()} - {dayModel.end.toDateString()}\n({'Slots: '+ dayModel.slots})
            </Text>
          ))} 
        </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
