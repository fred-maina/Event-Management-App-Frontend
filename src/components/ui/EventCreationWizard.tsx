// EventCreationWizard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';

// Import shadcn UI components (adjust the import paths as needed)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

// ---------------------------------------------------------------------
// Type Definitions & Initial Data
// ---------------------------------------------------------------------

interface TicketType {
  typeCategory: string;
  numberOfTickets: number;
  price: number;
}

interface EventData {
  eventName: string;
  eventVenue: string;
  eventTypes: number[]; // list of selected event type IDs
  eventDate: Date | null;
  eventEndDate: Date | null;
  startTime: string;
  endTime: string;
  isMultiDay: boolean;
  tickets: TicketType[];
  posterFile: File | null;
}

const initialEventData: EventData = {
  eventName: '',
  eventVenue: '',
  eventTypes: [],
  eventDate: null,
  eventEndDate: null,
  startTime: '',
  endTime: '',
  isMultiDay: false,
  tickets: [],
  posterFile: null,
};

const baseUrl = 'http://localhost:8080'; // Change if needed

// ---------------------------------------------------------------------
// Main Wizard Component
// ---------------------------------------------------------------------

const EventCreationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [eventData, setEventData] = useState<EventData>(initialEventData);
  const [token, setToken] = useState<string | null>(null);
  const totalSteps = 5;
  const progressPercent = (currentStep / totalSteps) * 100;

  // On mount, check for token and validate its expiry.
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (!tokenFromStorage) {
      navigate('/login');
      console.log("Nyeyeyeye")
      return;
    }
    try {
      // Decode JWT (assuming a JWT structure)
      const payload = JSON.parse(atob(tokenFromStorage.split('.')[1]));
      // Check token expiration (assuming exp is in seconds)
      if (payload.exp * 1000 < Date.now()) {
        console.warn("Token expired");
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error("Error decoding token", error);
      navigate('/login');
      return;
    }
    setToken(tokenFromStorage);
  }, [navigate]);

  // Navigation Handlers
  const handleNext = () => {
    // Optionally, add step-level validations here before proceeding.
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Update event data state
  const updateEventData = (data: Partial<EventData>) => {
    setEventData((prev) => ({ ...prev, ...data }));
  };

  // Helper to extract the creator ID from the token (adjust as needed)
  const extractCreatorId = (token: string): string => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (error) {
      return '';
    }
  };

  // On submit, format the payload as required by the backend.
  const handleSubmit = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Combine date and time fields into ISO strings.
    const eventStart = new Date(eventData.eventDate as Date);
    const [startHour, startMinute] = eventData.startTime.split(':');
    eventStart.setHours(parseInt(startHour, 10), parseInt(startMinute, 10));

    const eventEnd = new Date(
      eventData.isMultiDay && eventData.eventEndDate
        ? eventData.eventEndDate
        : eventData.eventDate as Date
    );
    const [endHour, endMinute] = eventData.endTime.split(':');
    eventEnd.setHours(parseInt(endHour, 10), parseInt(endMinute, 10));

    // Create the event payload.
    const eventPayload = {
      eventName: eventData.eventName,
      eventStartDate: eventStart.toISOString(),
      eventEndDate: eventEnd.toISOString(),
      eventVenue: eventData.eventVenue,
      eventCapacity: eventData.tickets.reduce((sum, ticket) => sum + ticket.numberOfTickets, 0),
      creatorId: extractCreatorId(token),
      ticketType: eventData.tickets.map(ticket => ({
        typeCategory: ticket.typeCategory,
        numberOfTickets: ticket.numberOfTickets,
        price: ticket.price,
      })),
      eventTypeIds: eventData.eventTypes,
    };

    const formData = new FormData();
    // Append the event payload as a Blob.
    formData.append("event", new Blob([JSON.stringify(eventPayload)], { type: "application/json" }));
    if (eventData.posterFile) {
      formData.append("poster", eventData.posterFile);
    }

    try {
      const response = await axios.post(`${baseUrl}/api/events/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not set Content-Type; let the browser add the correct multipart boundary.
        },
      });
      console.log('Event created successfully', response.data);
      // Optionally, redirect or display success feedback.
    } catch (error) {
      console.error('Error creating event', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        {/* Progress Bar */}
        <Progress value={progressPercent} className="mb-4" />

        {/* Animated Step Container */}
        <AnimatePresence>
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Step1 eventData={eventData} updateEventData={updateEventData} token={localStorage.getItem("token")} />
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Step2 eventData={eventData} updateEventData={updateEventData} />
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Step3 eventData={eventData} updateEventData={updateEventData} />
            </motion.div>
          )}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Step4 eventData={eventData} updateEventData={updateEventData} />
            </motion.div>
          )}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Step5 eventData={eventData} navigateToStep={setCurrentStep} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <div className="ml-auto">
            {currentStep < totalSteps && (
              <Button onClick={handleNext}>Next</Button>
            )}
            {currentStep === totalSteps && (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreationWizard;

// ---------------------------------------------------------------------
// Step 1: Basic Event Details
// ---------------------------------------------------------------------

interface Step1Props {
  eventData: EventData;
  updateEventData: (data: Partial<EventData>) => void;
  token: string | null;
}

const Step1: React.FC<Step1Props> = ({ eventData, updateEventData, token }) => {
  const navigate = useNavigate();
  const [eventTypes, setEventTypes] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .get(`${baseUrl}/api/events/event-types`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Check if the API returns an array directly or in a property.
        const types = Array.isArray(response.data)
          ? response.data
          : response.data.eventTypes || [];
        setEventTypes(types);
      })
      .catch((error) => {
        console.error('Error fetching event types', error);
      });
  }, [token, navigate]);

  const toggleEventType = (id: number) => {
    const currentTypes = eventData.eventTypes;
    if (currentTypes.includes(id)) {
      updateEventData({ eventTypes: currentTypes.filter((t) => t !== id) });
    } else {
      updateEventData({ eventTypes: [...currentTypes, id] });
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Basic Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <Input
              value={eventData.eventName}
              onChange={(e) => updateEventData({ eventName: e.target.value })}
              placeholder="Enter event name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Event Venue</label>
            <Input
              value={eventData.eventVenue}
              onChange={(e) => updateEventData({ eventVenue: e.target.value })}
              placeholder="Enter event venue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Event Types</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={eventData.eventTypes.includes(type.id) ? 'default' : 'outline'}
                  onClick={() => toggleEventType(type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ---------------------------------------------------------------------
// Step 2: Date & Time Selection
// ---------------------------------------------------------------------

interface Step2Props {
  eventData: EventData;
  updateEventData: (data: Partial<EventData>) => void;
}

const Step2: React.FC<Step2Props> = ({ eventData, updateEventData }) => {
  const handleDateChange = (date: Date | null) => {
    updateEventData({ eventDate: date });
    // If the event is single-day, sync the end date.
    if (!eventData.isMultiDay) {
      updateEventData({ eventEndDate: date });
    }
  };

  const handleMultiDayToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isMulti = e.target.checked;
    updateEventData({ isMultiDay: isMulti });
    if (!isMulti) {
      updateEventData({ eventEndDate: eventData.eventDate });
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Date & Time Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Event Date</label>
            <DatePicker
              selected={eventData.eventDate}
              onChange={(date: Date | null) => handleDateChange(date)}
              placeholderText="Select event date"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <TimePicker
              value={eventData.startTime}
              onChange={(time: string | null) => updateEventData({ startTime: time ?? '' })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">End Time</label>
            <TimePicker
              value={eventData.endTime}
              onChange={(time: string | null) => updateEventData({ endTime: time ?? '' })}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={eventData.isMultiDay}
              onChange={handleMultiDayToggle}
              id="multi-day"
              className="mr-2"
            />
            <label htmlFor="multi-day" className="text-sm">
              Multi-day event
            </label>
          </div>
          {eventData.isMultiDay && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <DatePicker
                selected={eventData.eventEndDate}
                onChange={(date: Date | null) => updateEventData({ eventEndDate: date })}
                placeholderText="Select end date"
                minDate={eventData.eventDate || new Date()}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ---------------------------------------------------------------------
// Step 3: Ticketing Options
// ---------------------------------------------------------------------

interface Step3Props {
  eventData: EventData;
  updateEventData: (data: Partial<EventData>) => void;
}

const Step3: React.FC<Step3Props> = ({ eventData, updateEventData }) => {
  const addTicket = () => {
    updateEventData({
      tickets: [
        ...eventData.tickets,
        { typeCategory: 'Custom Type', numberOfTickets: 0, price: 0 },
      ],
    });
  };

  const updateTicket = (index: number, updatedTicket: TicketType) => {
    const tickets = [...eventData.tickets];
    tickets[index] = updatedTicket;
    updateEventData({ tickets });
  };

  const removeTicket = (index: number) => {
    const tickets = eventData.tickets.filter((_, i) => i !== index);
    updateEventData({ tickets });
  };

  const totalTickets = eventData.tickets.reduce((sum, ticket) => sum + ticket.numberOfTickets, 0);

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ticketing Options</CardTitle>
        </CardHeader>
        <CardContent>
          {eventData.tickets.map((ticket, index) => (
            <div key={index} className="mb-4 border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Ticket Type {index + 1}</span>
                <Button variant="destructive" onClick={() => removeTicket(index)}>
                  Remove
                </Button>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Ticket Type</label>
                <Input
                  value={ticket.typeCategory}
                  onChange={(e) =>
                    updateTicket(index, { ...ticket, typeCategory: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Number of Tickets</label>
                <Input
                  type="number"
                  value={ticket.numberOfTickets}
                  onChange={(e) =>
                    updateTicket(
                      index,
                      { ...ticket, numberOfTickets: parseInt(e.target.value) || 0 }
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price</label>
                <Input
                  type="number"
                  value={ticket.price}
                  onChange={(e) =>
                    updateTicket(index, { ...ticket, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          ))}
          <Button onClick={addTicket}>Add Ticket Type</Button>
          {totalTickets <= 0 && (
            <p className="text-red-500 text-sm mt-2">
              Total number of tickets must be greater than zero.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ---------------------------------------------------------------------
// Step 4: Poster Upload
// ---------------------------------------------------------------------

interface Step4Props {
  eventData: EventData;
  updateEventData: (data: Partial<EventData>) => void;
}

const Step4: React.FC<Step4Props> = ({ eventData, updateEventData }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateEventData({ posterFile: e.target.files[0] });
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Poster Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {eventData.posterFile && (
            <p className="mt-2 text-sm">Selected file: {eventData.posterFile.name}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ---------------------------------------------------------------------
// Step 5: Review & Edit
// ---------------------------------------------------------------------

interface Step5Props {
  eventData: EventData;
  navigateToStep: (step: number) => void;
}

const Step5: React.FC<Step5Props> = ({ eventData, navigateToStep }) => {
  return (
    <div>
      <Card className="mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Review & Edit</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Basic Details Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Basic Details</span>
              <FaPencilAlt className="cursor-pointer" onClick={() => navigateToStep(1)} />
            </div>
            <p>Event Name: {eventData.eventName}</p>
            <p>Event Venue: {eventData.eventVenue}</p>
            <p>Event Types: {eventData.eventTypes.join(', ')}</p>
          </div>
          {/* Date & Time Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Date & Time</span>
              <FaPencilAlt className="cursor-pointer" onClick={() => navigateToStep(2)} />
            </div>
            <p>
              Event Date: {eventData.eventDate ? eventData.eventDate.toDateString() : 'Not selected'}
            </p>
            <p>Start Time: {eventData.startTime}</p>
            <p>End Time: {eventData.endTime}</p>
            {eventData.isMultiDay && eventData.eventEndDate && (
              <p>End Date: {eventData.eventEndDate.toDateString()}</p>
            )}
          </div>
          {/* Ticketing Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Ticketing Options</span>
              <FaPencilAlt className="cursor-pointer" onClick={() => navigateToStep(3)} />
            </div>
            {eventData.tickets.map((ticket, index) => (
              <div key={index}>
                <p>Type: {ticket.typeCategory}</p>
                <p>Number: {ticket.numberOfTickets}</p>
                <p>Price: ${ticket.price}</p>
              </div>
            ))}
          </div>
          {/* Poster Section */}
          <div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Poster</span>
              <FaPencilAlt className="cursor-pointer" onClick={() => navigateToStep(4)} />
            </div>
            {eventData.posterFile ? (
              <p>{eventData.posterFile.name}</p>
            ) : (
              <p>No poster uploaded.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
