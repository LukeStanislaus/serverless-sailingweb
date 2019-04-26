
import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  schema {
    query: RootQuery
    mutation: RootMutation
  }

  scalar Long

  type RootQuery {
    allBoatData: [BoatData]
    allEvents: [Event]
    recentEvents(input: RecentEventsInput!): [Event]
    specificEvent(input: SpecificEventInput!): [SignOn]
  }

  type RootMutation {
    createBoat(input: CreateBoatInput!): CreateBoatPayload
    createEvent(input: CreateEventInput!): CreateEventPayload
    signOn(input: SignOnInput!): SignOnPayload
    removeEvent(input: RemoveEventInput!): RemoveEventPayload
  }

  input RemoveEventInput{
    event: RemoveEventData!
  }
  input RemoveEventData{
    eventId: ID!
  }

  type RemoveEventPayload{
    event: RemoveEventPayloadData
  }
  type RemoveEventPayloadData{
    eventId: ID
  }

  input SpecificEventInput{
      eventData: SpecificEventInputData!
  }
  input SpecificEventInputData{
    eventId: ID!
  }
  type SignOn{
    eventId: ID!
    userId: ID!
    helmName: String!
    boatName: String!
    boatNumber: String!
    crew: String
    pY: Int!
    notes: String
    crewName: String

  }
  type BoatData {
      boatName: String!
      crew: Int!
      pY: Int!
  }
  type Event {
    eventId: ID!
    eventName: String!
    eventTimeStamp: Long!
    calendarData: calendarData
  }
  input SignOnInput{
    signOn: SignOnInputData!

  }
  input SignOnInputData{
    eventId: ID!
    userId: ID!
    helmName: String!
    boatName: String!
    boatNumber: String!
    crew: String
    pY: Int!
    notes: String
    crewName: String

  }
  type SignOnPayload{
    signOn: SignOn

  }
  input RecentEventsInput{
    range: RecentEventsInputRange!
  }
  input RecentEventsInputRange{
    start: Long!
    end: Long!
  }
  type CreateEventPayload{
    event: Event
  }
  input CreateEventInput{
    event: CreateEventData!
  }
  input CreateEventData {
    eventId: ID!
    eventName: String!
    eventTimeStamp: Long!
    calendarData: calendarDataInput
  }
  input CreatorInput{
    email: String
    displayName: String
    self: Boolean
  }
  input OrganizerInput{
    email: String
    displayName: String
    self: Boolean
  }
  input TimeInput{
    dateTime: String
  }
  input calendarDataInput{
    kind: String
    etag: String
    id: String
    status: String
    htmlLink: String
    created: String
    updated: String
    summary: String
    creator: CreatorInput
    organizer: OrganizerInput
    start: TimeInput
    end: TimeInput
    iCalUID: String
    sequence: Int
    location: String
  }
  type Creator{
    email: String
    displayName: String
    self: Boolean
  }
  type Organizer{
    email: String
    displayName: String
    self: Boolean
  }
  type Time{
    dateTime: String
  }
  type calendarData{
    kind: String
    etag: String
    id: String
    status: String
    htmlLink: String
    created: String
    updated: String
    summary: String
    creator: Creator
    organizer: Organizer
    start: Time
    end: Time
    iCalUID: String
    sequence: Int
    location: String
  }

  input CreateBoatInput{
    boatData: CreateBoatData!
  }
  input CreateBoatData {
    boatName: String!
    crew: Int!
    pY: Int!
}
  type CreateBoatPayload{
    boatData: BoatData
  }
`;
export default typeDefs;