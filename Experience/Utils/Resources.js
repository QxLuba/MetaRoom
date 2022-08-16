import * as THREE from "three"

import { EventEmitter } from "events";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import Experience from "../Experience.js";

export default class Resources extends EventEmitter{
    constructor(assets){
        super();
        this.experience = new Experience();
        this.renderer = this.experience.renderer;

        this.assets = assets;
        
        this.item = {};
        this.queue = this.assets.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders(){
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        
        // this.loaders.dracoLoader.setDecoderPath("/draco/");
        this.loaders.dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
        // this.loaders.dracoLoader.path = 'https://www.gstatic.com/draco/v1/decoders/';
        console.log(this.loaders.dracoLoader);
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);

    }

    startLoading(){
        for(const asset of this.assets){
            if(asset.type==="glbModel"){
                this.loaders.gltfLoader.load(asset.path,(file)=>{
                    this.singleAssetLoaded(asset,file)
                });
            }else if (asset.type === "videoTexture"){
                this.video = {};
                this.videoTexture = {};
                
                this.video[asset.name] = document.createElement("video");
                this.video[asset.name].src = asset.path;
                this.video[asset.name].muted = true;
                this.video[asset.name].autoplay = true;
                this.video[asset.name].loop = true;
                this.video[asset.name].play();

                this.videoTexture[asset.name] = new THREE.VideoTexture(
                    this.video[asset.name]
                );
                this.videoTexture[asset.name].flipY = true;
                this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].mageFilter = THREE.NearestFilter;
                this.videoTexture[asset.name].generateMipmaps = false;
                this.videoTexture[asset.name].encoding = THREE.sRGBEncoding;

                this.singleAssetLoaded(asset,this.videoTexture[asset.name]);
            }
        }
    }

    singleAssetLoaded(asset,file){
        this.item[asset.name] = file;
        this.loaded++;

        console.log(file);
        if(this.loaded === this.queue){
            console.log("all asset are done");
            this.emit("ready");
        }
    }
}