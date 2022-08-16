import * as THREE from "three"
import Experience from "./Experience";
import Renderer from "./Renderer";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import { Scene } from "three";


export default class Camera{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        // console.log(this.experience,this.sizes,this.scene,this.canvas);

        this.createPerspectiveCamera();
        this.createOrthographicCamera();

        this.setOrbitControls();
    }

    createPerspectiveCamera(){
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            35,
            this.sizes.aspect,
            0.1,
            1000
        );
        this.scene.add(this.perspectiveCamera)
        this.perspectiveCamera.position.x = 29;
        this.perspectiveCamera.position.y = 14;
        this.perspectiveCamera.position.z = 12;
    }

    createOrthographicCamera(){
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum)/1.5,
            (this.sizes.aspect * this.sizes.frustrum)/1.5,
            this.sizes.frustrum / 1.5,
            -this.sizes.frustrum / 1.5,
            -20,
            20
        );
        this.orthographicCamera.position.x = 0;
        this.orthographicCamera.position.y = 4.2;
        this.orthographicCamera.position.z = 4;

        this.orthographicCamera.rotation.x = -Math.PI / 6;

        this.scene.add(this.orthographicCamera)
        // this.helper = new THREE.CameraHelper(this.orthographicCamera);
        // this.scene.add(this.helper);

        const size = 20;
        const divisions = 20;

        // const gridHelper = new THREE.GridHelper(size,divisions);
        // const axesHelper = new THREE.AxesHelper(10);
        // this.scene.add(gridHelper,axesHelper)
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.perspectiveCamera,this.canvas);
        this.controls.enableDamping = true;
        this.controls.enableZoom = false;
    }


    resize(){
        //在Resize的时候更新透视相机
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();

        //在Resize的时候更新平行相机
        this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustrum)/2;
        this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustrum)/2;
        this.orthographicCamera.top = this.sizes.frustrum / 2;
        this.orthographicCamera.bottom = -this.sizes.frustrum / 2;
        this.orthographicCamera.updateProjectionMatrix();
    }

    update(){
        this.controls.update();
        // this.helper.matrixWorldNeedsUpdate = true;
        // this.helper.update();
        // this.helper.position.copy(this.orthographicCamera.position);
        // this.helper.rotation.copy(this.orthographicCamera.position);
    }

}