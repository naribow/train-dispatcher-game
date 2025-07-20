export class Signal {
  public readonly id: string;
  public readonly poiId: string;
  public readonly controlledSegmentId: string;
  public currentState: 'red' | 'yellow' | 'blue';

  constructor(id: string, poiId: string, controlledSegmentId: string, initialState: 'red' | 'yellow' | 'blue') {
    this.id = id;
    this.poiId = poiId;
    this.controlledSegmentId = controlledSegmentId;
    this.currentState = initialState;
  }

  toggle(): void {
    switch (this.currentState) {
      case 'red':
        this.currentState = 'yellow';
        break;
      case 'yellow':
        this.currentState = 'blue';
        break;
      case 'blue':
        this.currentState = 'red';
        break;
    }
  }
}
