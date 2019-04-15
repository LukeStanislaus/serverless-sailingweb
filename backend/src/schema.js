
import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
scalar Long
  type RootQuery {
    allBoatData: [BoatData]
    allEvents: [Event]
    recentEvents(input: RecentEventsInput!): [Event]
    specificRace(input: SpecificRaceInput!): [signOn]
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
  type RootMutation {
    updateBoatData(input: UpdateBoatDataInput!): UpdateBoatDataPayload
    createEvents(input: CreateEventsInput!): CreateEventsPayload
    signOn(input: SignOnInput!): SignOnPayload
    
  }

  input SpecificRaceInput{
      eventId: ID!
  }
  type signOn{
    eventId: ID!
    userId: ID!
    boatName: String!
    boatNumber: String!
    crew: String
    pY: Int!
    notes: String

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
  }
  input SignOnInput{
      eventId: ID!
      userId: ID!
      boatName: String!
      boatNumber: String!
      crew: String
      pY: Int!
      notes: String

  }
  type SignOnPayload{
      
  }
  input RecentEventsInput{
    start: Long!
    end: Long!
  }
  type CreateEventsPayload{
    result: String
  }
  input CreateEventsInput{
    eventId: ID!
    eventName: String!
    eventTimeStamp: Long!
    calendarData: calendarData
  }
  input Creator{
    email: String
    displayName: String
    self: Boolean
  }
  input Organizer{
    email: String
    displayName: String
    self: Boolean
  }
  input Time{
    dateTime: String
  }
  input calendarData{
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
  input UpdateBoatDataInput{
    boatName: String!
    crew: Int!
    pY: Int!
  }
  type UpdateBoatDataPayload{
    boatData: BoatData
  }
`;
export default typeDefs;