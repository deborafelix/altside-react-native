import React, {useState, useEffect, useContext} from 'react';
import moment from 'moment';

import {Text, ScrollView} from './styles';
import Week from '../../components/Week';
import Header from '../../components/Header/Feed';
import EventCard from '../../components/EventCard';
import Menu from '../../containers/Menu';
import {getAll} from '../../services/event';
import {Alert} from 'react-native';
import Context from '../../contexts';

export default function Feed({navigation}) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const {selectedDate, signOut} = useContext(Context);
  useEffect(() => {
    try {
      const getAllEvents = async () => {
        const newEvents = await getAll();
        setEvents(newEvents);
      };
      getAllEvents();
    } catch (e) {
      Alert.alert('Erro', 'Erro inesperado, tente novamente', [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    }
  }, []);
  const handleOnPress = (event) => {
    navigation.navigate('InfoEvent', event);
  };
  useEffect(() => {
    const tmpEvents = events.filter(
      (event) =>
        moment(event.date).format('D MM') ===
        moment(selectedDate).format('D MM'),
    );
    setFilteredEvents(tmpEvents);
  }, [selectedDate, events]);

  const handleGoHome = () => {
    navigation.navigate('Feed');
  };

  const handleGoMyEvents = () => {
    navigation.navigate('MyEvents');
  };

  const handleGoOut = () => {
    signOut();
    navigation.navigate('OnBoard');
  };

  return (
    <>
      <Header />
      <Week />
      <ScrollView>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              handleOnPress={() => handleOnPress(event)}
            />
          ))
        ) : (
          <Text>Sem eventos nessa data...</Text>
        )}
      </ScrollView>
      <Menu
        selected="home"
        handleGoHome={handleGoHome}
        handleGoOut={handleGoOut}
        handleGoMyEvents={handleGoMyEvents}
      />
    </>
  );
}
