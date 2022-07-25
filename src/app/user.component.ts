import { Component, Input } from "@angular/core";
import { Moralis } from 'moralis';

export type User = Moralis.User<Moralis.Attributes>;

@Component({
  selector: 'app-user',
  template: `
  <div
  style="display: flex;
  flex-direction: column;
  align-items: center;
  width: 50vw;
  margin: 10px auto;
  color: white;">      
    <ng-container *ngIf="user; else userNotDefined">
      <pre style="display: flex;">
      <strong>Address: </strong>
      <a
      style = "color: #69f0ae;"
      href="https://rinkeby.etherscan.io/address/{{ user?.attributes?.ethAddress }}" target="_blank">{{ user?.attributes?.ethAddress }}</a>
      </pre>
    </ng-container>
    <ng-template #userNotDefined>
        <pre>User not specified, please log in.</pre>
    </ng-template>
  </div>
  `
})

export class UserComponent {
    @Input() user?: User;
}