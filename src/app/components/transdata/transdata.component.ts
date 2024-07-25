import { Component, effect } from '@angular/core';
import { HlmDialogService } from 'src/lib/ui-dialog-helm/src';
import { AddTransComponent } from '../add-trans/add-trans.component';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-transdata',
  templateUrl: './transdata.component.html',
  styleUrl: './transdata.component.css',
})
export class TransdataComponent {
  user: User | null = null;
  constructor(
    private dailog: HlmDialogService,
    private autjService: AuthService
  ) {
    effect(() => {
      this.user = this.autjService.user();
    });
  }
  openDailog() {
    if (this.user !== null) {
      const dailogRef = this.dailog.open(AddTransComponent, {
        context: {
          user: this.user,
          isEditing: false,
        },
        contentClass:
          'overflow-x-hidden overflow-y-scroll max-h-screen md:w-[40vw] lg:w-[30vw] w-[90vw] noScroll dark:text-white text-black',
      });
    }
  }
}
