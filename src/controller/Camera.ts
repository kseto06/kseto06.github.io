// Controller 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class CameraControls {
    private controls: OrbitControls;

    constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.set(0, 1, 0);
    }

    update(): void {
        this.controls.update();

        //Prevent down rotation
        this.controls.maxPolarAngle = Math.PI / 2;
    }
}