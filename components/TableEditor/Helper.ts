import moment from 'moment/moment';
import 'moment/locale/id';

export const omitID = (key: string, value: string) => {
  if (key == 'id') {
    return undefined;
  } else {
    return value;
  }
};

export const formatDate = (obj: string | number, fromDB: boolean) => {
  if (obj) {
    moment.locale('id');

    if (fromDB) {
      return moment(obj).format('L');
    } else {
      return moment(obj, 'DD-MM-YYYY').format('L');
    }
  } else {
    return null;
  }
};
