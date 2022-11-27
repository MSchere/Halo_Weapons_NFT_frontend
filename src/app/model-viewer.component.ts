import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-model-viewer',
  template: `
  <div style="
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%; height: 100%;">
    <div style="border: 1px solid white; background: rgba(0, 0, 0, 0); width:100%">
      <model-viewer style="width: 100%; height: 40vh; position: relative;"
        bounds="tight" enable-pan src={{this.glbPath}}
        ar ar-modes="webxr scene-viewer quick-look"
        camera-controls
        environment-image="neutral"
        poster={{this.posterPath}}
        shadow-intensity="1" auto-rotate
        >
        <button mat-button slot="ar-button" style="
        position: absolute;
        border-top: 1px solid white;
        bottom: 0px;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
        color:white">
      Activate AR
        </button>
      </model-viewer>
      <button mat-button style="
      position: absolute;
      left: 0; top: 0;
      color: white;
      height: 40vh;"
      (click)="getWeapon(false)">
        <mat-icon aria-hidden="false" aria-label="Back Arrow" fontIcon="arrow_back_ios"></mat-icon>
      </button>
      <button mat-button style="
      position: absolute;
      right: 0; top: 0;
      color: white;
      height: 40vh;"
      (click)="getWeapon(true)">
        <mat-icon aria-hidden="false" aria-label="Front Arrow" fontIcon="arrow_forward_ios"></mat-icon>
      </button>
    </div>
    <h2>{{this.weaponName}}</h2>
    <p style="
    text-align: justify;
    text-justify: inter-word;">
    {{this.description}}
    </p>
  </div>  
  `,
  styles: []
})

export class ModelViewerComponent implements OnInit {
  index: any;
  maxIndex: any;
  weapon: any = this.getRandomWeapon(); //gets random weapons when loading webpage
  glbPath: string = 'assets/models_glb/' + this.weapon.fileName + '.glb';
  posterPath: string = 'assets/posters/' + this.weapon.fileName + '.png';
  description: string = this.weapon.description;
  weaponName: string = this.weapon.name;
  poster: any; //only for ipfs metadata retrieval
  model: any; //same

  constructor() { }

  ngOnInit(): void {
  }

  //Recovers random metadata from local json
  getRandomWeapon() {
    //weapons array from weapons.json
    const weapons = require('../assets/weapons.json');
    this.maxIndex = Object.keys(weapons).length - 1;
    //random number between 0 and the length of the weapons array
    const randomNumber = Math.floor(Math.random() * this.maxIndex);
    this.index = randomNumber;
    //returns a random weapon from the weapons array
    const weapon = weapons[Object.keys(weapons)[randomNumber]];
    return weapon;
  }

  //Recovers next or previous metadata from local json
  getWeapon(isNext: boolean) {
    let currentIndex = this.index; //current index of the weapons array
    let idx: number;

    if (isNext) {
      //if the current index is the last index of the weapons array, go back to the first index
      if (currentIndex === this.maxIndex) idx = 0;
      //else go to the next index
      else idx = currentIndex + 1;
    }
    else {
      //if the current index is the first index of the weapons array, go to the last index
      if (currentIndex === 0) idx = this.maxIndex;
      //else go to the prev index
      else idx = currentIndex - 1;
    }
    this.index = idx; //update the index

    const weapons = require('../assets/weapons.json');
    //returns the indexed weapon from the weapons array
    const weapon = weapons[Object.keys(weapons)[idx]];
    console.log(weapon);
    //updates the component properties
    this.weapon = weapon;
    this.weaponName = weapon.name;
    this.description = weapon.description;
    this.glbPath = 'assets/models_glb/' + this.weapon.fileName + '.glb';
    this.posterPath = 'assets/posters/' + this.weapon.fileName + '.png';
  }

  //Recovers metadata from IPFS. Very slow for this demo!
  async getMetadata(idx: number) {
    //https gateway for IPFS
    const gateWay = "https://ipfs.io/ipfs/";
    //IPFS uri of the metadata json
    const uri = gateWay + "bafybeiftwmde7cqptm5lgzmonjkwxripziww45gis6fl6u5jt6zqqeufi4/" + idx;
    try {
      const meta: any = await axios.get(uri)
        .catch(function (error) { console.log(error); });
      console.log(meta);
      //returns the metadata properties
      this.poster = gateWay + meta.data.image.substring(7, meta.data.image.length);
      this.model = gateWay + meta.data.animation_url.substring(7, meta.data.animation_url.length);
      this.weaponName = meta.data.name;
      this.description = meta.data.description;
    } catch (error) {
      console.log(error);
    }
  }
}

