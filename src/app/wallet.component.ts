import { Component, Input } from "@angular/core";

export type Wallet = string;

@Component({
  selector: 'app-wallet',
  template: `
  <div
  style="display: flex;
  flex-direction: column;
  align-items: center;
  width: 50vw;
  margin: 10px auto;
  color: white;">      
    <ng-container *ngIf="wallet; else userNotDefined">
      <pre style="display: flex;">
      <strong>Address: </strong>
      <a
      style = "color: #69f0ae;"
      href="https://testnet.snowtrace.io/address/{{ wallet }}" target="_blank">{{ wallet }}</a>
      </pre>
    </ng-container>
    <ng-template #userNotDefined>
        <pre>User not specified, please log in.</pre>
    </ng-template>
  </div>
  `
})

export class UserComponent {
    @Input() wallet?: string;
}