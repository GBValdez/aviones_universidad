import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { convertMomentToDate } from './formatDate';

export const fixedQueryParams = (params: any) => {
  let paramsFinal: any = {};
  let paramsInit = convertMomentToDate(params);
  for (let key in paramsInit) {
    if (
      paramsInit[key] !== '' &&
      paramsInit[key] !== null &&
      paramsInit[key] !== undefined
    ) {
      if (paramsInit[key] instanceof Date) {
        paramsFinal[key] = paramsInit[key].toISOString();
      } else if (Array.isArray(paramsInit[key])) {
        const array: any[] = paramsInit[key];
        paramsFinal[key] = array.join(',');
      } else paramsFinal[key] = paramsInit[key];
    }
  }
  return paramsFinal;
};

// export const formIsEmptyValidator: ValidatorFn = (control) => {
//   let isEmpty = true;
//   Object.keys(control.value).forEach((key) => {
//     if (control.value[key] !== null && control.value[key].trim() !== '') {
//       isEmpty = false;
//     }
//   });
//   return isEmpty ? { formIsEmpty: true } : null;
// };

export function formIsEmptyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let isEmpty = true;
    const keys: string[] = Object.keys(control.value);
    for (let key of keys) {
      if (control.value[key] != null) {
        if (typeof control.value[key] === 'string') {
          if (control.value[key].trim() !== '') isEmpty = false;
        } else if (Array.isArray(control.value[key])) {
          if (control.value[key].length > 0) isEmpty = false;
        } else isEmpty = false;

        if (!isEmpty) break;
      }
    }

    return !isEmpty ? null : { formNotEmpty: true };
  };
}
