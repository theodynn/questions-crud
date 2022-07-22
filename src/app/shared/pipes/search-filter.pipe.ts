import { Pipe, PipeTransform } from '@angular/core';
import { Questions } from 'src/app/questions/store/questions';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    value = value.filter((el: Questions) =>  (args[1] && el.state.length > 0) || (!args[1] && el.state.length === 0))
    return value;
  }

}
