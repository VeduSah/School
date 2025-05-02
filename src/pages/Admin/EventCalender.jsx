import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import {
  EventCalendarContainer,
  Content,
  CalendarContainer,
  Events,
  Event,
  AddEventForm,
  EventInput,
  AddEventButton,
  ErrorText,
} from '../../styles/EventCalendarStyles';

const EventCalendar = () => {
  const [events, setEvents] = useState([]); // Stores events array
  const [newEvent, setNewEvent] = useState(''); // Stores event input
  const [error, setError] = useState(null); // Stores error message
  const [forceRender, setForceRender] = useState(false);  // For forcing re-render

  // Function to fetch events from the backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/events/getall');
      console.log('API Response:', response.data);  // Add this for debugging
      setEvents(response.data.event);  // Set the events from the API
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error fetching events');
    }
  };
  

  useEffect(() => {
    fetchEvents(); // Fetch events on component mount
  }, []); // Empty dependency array ensures it runs once

  // Function to add a new event
  const addEvent = async (e) => {
    e.preventDefault();
  
    // Check if the new event is empty
    if (!newEvent.trim()) {
      setError('Please fill out the event field');
      return; // Don't proceed if the event field is empty
    }
  
    try {
      const response = await axios.post('http://localhost:4000/api/v1/events', {
        events: newEvent,  // Send the event as "events" (matches the backend schema)
      });
  
      console.log('Added event:', response.data.event);  // Log for debugging
  
      // Update the state with the newly added event
      setEvents((prevEvents) => {
        const updatedEvents = [...prevEvents, response.data.event];
        console.log('Updated Events:', updatedEvents);  // Log updated events
        return updatedEvents;
      });
  
      // Clear the form input and error
      setNewEvent('');
      setError(null); // Clear any previous error messages
  
    // Reload the page to reflect the new events list
    window.location.reload();  // Reload the page to fetch updated events
      // Comment out the force render part
      // setForceRender(!forceRender);  // Toggle to force re-render
    } catch (error) {
      console.error('Error adding event:', error);
  
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Display specific error message from backend
      } else {
        setError('Error adding event'); // General error message
      }
    }
  };

  return (
    <EventCalendarContainer>
      <Sidebar />
      <Content style={{ display: 'grid', justifyContent: 'center' }}>
        <h1>Events & Calendar</h1>
        <div>Current Time: {new Date().toLocaleString()}</div>
        <CalendarContainer>
          {/* Display Calendar Here */}
          Calendar
        </CalendarContainer>

        <AddEventForm onSubmit={addEvent}>
          <h2>Add New Event</h2>

          {/* Event Input Field */}
          <EventInput
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)} // Update state as user types
            placeholder="Enter Event"
          />

          {/* Submit Button */}
          <AddEventButton type="submit">Add Event</AddEventButton>
        </AddEventForm>

        {/* Error Text */}
        {error && <ErrorText>{error}</ErrorText>}
        <Events>
  <h2>Events</h2>
  {events && events.length === 0 ? (
    <div>No events available</div>
  ) : (
    events && events.map((event) => (
      <Event key={event._id}>{event.events}</Event>
    ))
  )}
</Events>
      </Content>
    </EventCalendarContainer>
  );
};

export default EventCalendar;
