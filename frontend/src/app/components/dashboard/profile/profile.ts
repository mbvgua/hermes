import {
  Component,
  inject,
  OnInit,
  signal,
  AfterViewInit,
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser, UserResponse, UserRoles } from '../../../models/users.models';
import { Users } from '../../../services/users/users';
import { LocalStorage } from '../../../services/local-storage/local-storage';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit{
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor(
    private userService: Users,
    private ls: LocalStorage,
  ) {}

  //signals
  status = signal<string>('');
  message = signal<string>('');
  token = signal<string>('');
  user: IUser[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.token.set(this.ls.getItem('token') ?? '');

    this.userService.getUser().subscribe(
      (response: UserResponse) => {
        this.status.set(response.status);
        this.message.set(response.message);
        console.log('response: ', response.data?.user);
      },
      (error: UserResponse | any) => {
        this.status.set(error.status);
        this.message.set(error.message);
        console.log(this.message());
        // if statements to handle diff kinds of nesting
        if (error.error.code == 422 || error.error.code == 500) {
          this.status.set(error.error.status);
          this.message.set(error.error.message);
        }
      },
    );
  }
}
