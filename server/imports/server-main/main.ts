import { SystemOptions } from '../../../both/collections/systemOptions.collection';
import '../cronjobs/cronjob';

export class Main {
  start(): void {
    let result = SystemOptions.collection.findOne({name: "mailOptions"});

    process.env.MAIL_URL = result.value.connectionString;
  }
}
