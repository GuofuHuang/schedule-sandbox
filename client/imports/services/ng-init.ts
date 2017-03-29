import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[ngInit]'
})
export class NgInit {
  @Input() ngInit;
  ngOnInit() {
    if (this.ngInit) {

      // console.log(this.ngInit())
      console.log('asdf');

    }
  }
}
