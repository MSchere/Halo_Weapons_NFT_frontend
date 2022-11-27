import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { ethers, Contract, Signer } from 'ethers';
import '@google/model-viewer';
import HaloNFT_abi from '../assets/contracts/HaloNFT.json';
import HaloNFT_address from '../assets/contracts/HaloNFT-address.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Wallet } from './wallet.component';
declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Halo Weapons NFT';

  custom_address: any;
  custom_uri: any;

  chainId?: number;
  wallet?: Wallet;
  contract: Contract;
  provider?: ethers.providers.Web3Provider;

  constructor(
    private snackBar: MatSnackBar
  ) {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer: Signer = this.provider.getSigner();
    this.contract = new ethers.Contract(HaloNFT_address.address, HaloNFT_abi.abi, signer);
  }

  async ngOnInit() {
    const network = await this.provider?.getNetwork();
    this.chainId = network?.chainId;
  }

  // logins the user with Metamask
  async login() {
    try {
      await this.getCurrentChainId();
      if (this.chainId != 43113) {
        await this.switchChain();
      }
      const requestAccount = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const selectedAddress = requestAccount[0];
      const msgToSign = '0x' + Buffer.from('Log into this dapp').toString('hex');
      const requestSignature = await window.ethereum.request({ method: 'personal_sign', params: [msgToSign, selectedAddress] })
      if (!requestSignature) {
        throw Error('Metamask signature not found')
      }
      this.wallet = selectedAddress;
      console.log("User logged in with address " + this.wallet);
    } catch (error: any) {
      console.error('Error:', error);
      this.snackBar.open('There was a problem logging in, please try again ❌', '', { duration: 3000 });
    }
  }

  // logs the user out
  async logOut() {
    this.wallet = undefined;
  }

  // mints a random NFT
  async mintRandom() {
    const weapons = require('../assets/weapons.json');
    let maxIndex: number = Object.keys(weapons).length - 1;
    let id: number = Math.floor(Math.random() * maxIndex); // random number between 0 and maxIndex
    let uri: string = "bafybeiftwmde7cqptm5lgzmonjkwxripziww45gis6fl6u5jt6zqqeufi4/" + id;
    let account: any = this.wallet;
    await this.mint(account, uri);
  }

  // mints an NFT with custom metadata
  async mintCustom() {
    await this.mint(this.custom_address, this.custom_uri);
  }

  // calls the minting function of the contract
  async mint(account: string, uri: string) {
    ;
    console.log("Minting NFT for user " + account + "from contract " + this.contract.address + " with URI " + uri);
    let tx = await this.contract.safeMint(account, uri);
    await tx.wait();
    this.snackBar.open('Transaction completed successfully ✅', '', { duration: 3000 });
  }

  async switchChain() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0xA869" }],
      });
      this.chainId = 43113;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code == 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: "0xA869",
              chainName: "Avalanche Fuji Testnet",
              nativeCurrency: {
                name: "AVAX",
                symbol: "AVAX",
                decimals: 18
              },
              rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
              blockExplorerUrls: ["https://testnet.snowtrace.io/"]
            }],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      this.chainId = 43113;
      if (switchError.code != 4902) {
        console.error(switchError);
        throw new Error('Code: ' + switchError.code + '. Message: ' + switchError.message);
        this.snackBar.open('There was an error switching chains ❌', '', { duration: 3000 });
      }
    }
  }

  async getCurrentChainId() {
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const chainId = parseInt(chainIdHex, 16);
    this.chainId = chainId;
  }
}

