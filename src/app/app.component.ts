import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { User } from './user.component';
import { Moralis } from 'moralis';
import '@google/model-viewer';
import HaloNFT_abi from '../assets/contracts/HaloNFT.json';
import HaloNFT_address from '../assets/contracts/HaloNFT-address.json';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Halo Weapons NFT';

  custom_address: any;
  custom_uri: any;

  user?: User;

  constructor(
      private snackBar: MatSnackBar
    ) {}

  ngOnInit() {
    Moralis.start({
      appId: environment.appId,
      serverUrl: environment.serverUrl
    })
    .then(() => console.log('DApp initialized'))
    .finally(() => this.user = Moralis.User.current())
  }

  // logins the user with Metamask
  async login() {
    let user = Moralis.User.current();
    if (!user) {
        try {
            user = await Moralis.authenticate({ signingMessage: "Authenticate" })
            await Moralis.enableWeb3();
            console.log(user)
            console.log(user.get('ethAddress'))
            this.user = Moralis.User.current()
          } catch (error) {
            console.log(error)
        }
    }
}

// logs the user out
async logOut() {
    await Moralis.User.logOut()
    .then((loggedOutUser) => console.log(`User logged off`, loggedOutUser))
    .then(() => this.user = Moralis.User.current())
    .then(() => Moralis.cleanup())
    .catch((e) => console.error('Moralis logout error:', e));
    console.log("Logged Out");
}

  // mints a random NFT
  async mintRandom() {
    const weapons = require('../assets/weapons.json');
    let maxIndex : number = Object.keys(weapons).length-1;
    let id : number = Math.floor(Math.random() * maxIndex); // random number between 0 and maxIndex
    let uri : string = "bafybeiftwmde7cqptm5lgzmonjkwxripziww45gis6fl6u5jt6zqqeufi4/" + id;
    let account : string = this.user?.attributes?.ethAddress;
    await this.mint(account, uri);
  }

  // mints an NFT with custom metadata
  async mintCustom() {
    await this.mint(this.custom_address, this.custom_uri);
  }

  // calls the minting function of the contract
  async mint(account: string, uri: string) {
    await Moralis.enableWeb3();
    let address : string = HaloNFT_address.address_rinkeby;
    
    console.log("Minting NFT for user " + account + "from contract " + address + " with URI " + uri);
    let options = {
      contractAddress: address,
      functionName: "safeMint",
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "uri",
              "type": "string"
            },
          ],
          "name": "safeMint",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
      ],
      params: {
        to: account,
        uri: uri,
      }
    };
    await Moralis.executeFunction(options);
    this.snackBar.open('Transaction sent successfully ✅', '' , {duration: 3000});
  }

  // creates a Moralis event listener for the NFT minting event (server only function)
  async addMintEventListener() {
    let address : string = HaloNFT_address.address_rinkeby;
    let options = {
      chainId: "0x539",
      contractAddress: address,
      topic: "Transfer(address, address, uint256)",
      abi: [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
      ],
      limit: 500,
      tableName: "minting_events",
      sync_historical: false,
    };
    await Moralis.Cloud.run("watchContractEvent", options, { useMasterKey: false });
  }
}

