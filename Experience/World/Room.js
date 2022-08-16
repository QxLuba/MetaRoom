import * as THREE from "three"
import * as GSAP from "gsap/all.js"
import Experience from "../Experience.js";

export default class Room{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        this.room = this.resources.item.room;
        this.actualRoom = this.room.scene;

        this.lerp = {
            current: 0,
            target:0,
            ease:0.1,
        }


        this.setModel();
        this.setAnimation();
        this.onMouseMove();
    }

    setModel(){
        this.scene.add(this.actualRoom)
        this.actualRoom.children.forEach(child => {
            child.castShadow = true;
            child.receiveShadow = true;
            if(child instanceof THREE.Group){
                child.children.forEach((groupchild)=>{
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            };
            if(child.name ==="Armature"){
                child.children[1].material = new THREE.MeshStandardMaterial();
            }
        });
    }

    setAnimation(){
        this.mixer = new THREE.AnimationMixer(this.actualRoom);
        this.swim = this.mixer.clipAction(this.room.animations[0]);
        this.swim.play();
    }

    onMouseMove(){
        window.addEventListener("mousemove",(e)=>{
            this.rotation = ((
                e.clientX-window.innerWidth/2)*2)/window.innerWidth;
            this.lerp.target = this.rotation * 0.1;
        })
    }

    resize(){}

    update(){
        this.lerp.current = GSAP.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualRoom.rotation.y = this.lerp.current;
        this.mixer.update(this.time.delta * 0.0009);
    }
}