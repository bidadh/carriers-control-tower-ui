import {Pipe, PipeTransform} from '@angular/core';
import {Event} from "../shared/model/event";
import {Criticality, CriticalityUtil} from "../shared/model/criticality";

@Pipe({
  name: 'eventCriticality'
})
export class EventCriticalityPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    // @ts-ignore
    let items: Event[] = value;
    // @ts-ignore
    let filters: CriticalityFilter[] = args
    let filter: CriticalityFilter = filters[0]
    // @ts-ignore
    let c: Criticality = filter.criticality
    return items
      .filter(it => it.criticalityLevel() >= CriticalityUtil.level(c))
  }

}

export interface CriticalityFilter {
  criticality: Criticality
}

