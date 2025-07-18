export interface SignalData {
  id: string;
  poiId: string;
  controlledSegmentId: string;
  initialState: 'red' | 'yellow' | 'blue';
}
