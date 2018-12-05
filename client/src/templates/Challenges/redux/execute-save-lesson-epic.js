import {of } from 'rxjs';
import { ofType } from 'redux-observable';
import {
  switchMap,
  ignoreElements,
  catchError
} from 'rxjs/operators';

import {
  types,
  disableJSOnError
} from './'

function executeSaveLessonEpic(action$, state$, { document }) {
  return of(document).pipe(
    switchMap(() => {
      const saveOutput = action$.pipe(
        ofType(types.executeSaveLesson),
        switchMap(() => {
          console.log('// console output') //send console outputs
          localStorage.setItem(state$.value.challenge.challengeMeta.id,
            state$.value.challenge.challengeFiles.indexhtml.contents)
        }),
        catchError(err => {
          console.error(err);
          return of(disableJSOnError(err));
        })
      );
      return saveOutput;
    })
  );
}

export default executeSaveLessonEpic;
