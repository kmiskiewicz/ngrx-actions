import { Injectable, Type } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface H {
  type: string;
}

@Injectable({ providedIn: 'root' })
export class ActionsService {
  constructor(private actionsSubject: ActionsSubject) {}

  dispatch<T extends Action, K extends keyof T>(context: any, action: Type<T>, payload: Exclude<T[K], H> = null) {
    const callingCmp: string = context.__proto__.constructor.name;
    const instance: T = new action(payload);
    instance.type = `[${callingCmp}] ${instance.type}`;
    this.actionsSubject.next(instance);
  }
}

export const debugTypeMap = (effect: string) => (source: Observable<any>): Observable<any> => {
  return source.pipe(
    map(res => {
      if (!res.type) {
        return res;
      }
      if (res.type) {
        res.type = `[${effect}] ${res.type}`;
        return res;
      }
      if (res[0].type) {
        res.map(action => (action.type = `[${effect}] ${action.type}`));
        return res;
      }
    })
  );
};