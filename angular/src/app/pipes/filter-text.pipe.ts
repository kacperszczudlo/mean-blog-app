import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter', 
  standalone: true
})
export class FilterTextPipe implements PipeTransform {

  transform(value: any[], filterText: string): any[] {
  if (!value) return [];
  if (!filterText) return value;

  filterText = filterText.toLowerCase();

  return value.filter(val => {
    const textMatch = val.text && val.text.toLowerCase().includes(filterText);
    const titleMatch = val.title && val.title.toLowerCase().includes(filterText);
    return textMatch || titleMatch;
  });
}
}