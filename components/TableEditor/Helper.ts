import moment from 'moment/moment';
import localization from 'moment/locale/id';

export function omitID(key: string, value: string) {
  if (key == 'id') {
    return undefined;
  } else {
    return value;
  }
}

export const formatDate = (obj: string | number, fromDB: boolean) => {
  if (obj) {
    moment.updateLocale('id', localization);

    if (fromDB) {
      return moment(obj).format('L');
    } else {
      return moment(obj, 'DD-MM-YYYY').format('L');
    }
  } else {
    return null;
  }
};
