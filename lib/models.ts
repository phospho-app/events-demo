export interface EventDefinition {
  event_name: string
  description: string
}

export interface Event {
  id: string
  event_name: string
  event_definition: EventDefinition
}
