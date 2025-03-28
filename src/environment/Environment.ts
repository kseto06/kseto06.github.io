import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export default class Environment {
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;

    private petals: THREE.Object3D[] = [];
    private loader = new GLTFLoader();

    constructor(container: HTMLElement) {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xbfdffb);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 3, 9);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        this.loadEnv();

        window.addEventListener('resize', this.handleResize.bind(this));
    }

    private loadEnv() {
        //Lighting & Properties
        this.addLighting();

        //Objects
        this.addGround();
        this.loadToriiGate();
        this.loadTrees();
        this.loadStonePath();
        this.loadLanterns();
        this.loadPetals();

        //UI
        this.addTextPlane();
    }

    private addLighting() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(0xffffff, 0.8);
        sun.position.set(5, 10, 7.5);
        this.scene.add(sun);

        const hemi = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(hemi);
    }

    private addGround() {
        const groundGeo = new THREE.PlaneGeometry(10, 12);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x88cc88 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.06;
        ground.position.z = 2.0
        this.scene.add(ground);
    }

    private loadToriiGate() {
        this.loader.load('/models/torii_gate.glb', (gltf) => {
            const torii = gltf.scene;
            torii.scale.set(1, 1, 1);
            torii.position.set(0, 0, 0);
            this.scene.add(torii);
        });
    }
      
    private loadTrees() {
        this.loader.load('/models/sakura_tree_low_poly_model.glb', (gltf) => {
            const tree = gltf.scene;
            tree.scale.set(15, 15, 15);
        
            const spacing = 4; // Spacing between lanterns
            const zOffset = 0; 
        
            const leftTree = tree.clone();
            leftTree.position.set(-spacing, 0, zOffset);
            this.scene.add(leftTree);
        
            const rightTree = tree.clone();
            rightTree.position.set(spacing, 0, zOffset);
            this.scene.add(rightTree);
        });
    }
      
    private loadStonePath() {
        this.loader.load('/models/stone_path.glb', (gltf) => {
            const stonePath = gltf.scene;
            stonePath.scale.set(1.4, 1, 1);
            stonePath.position.set(0, 0, 2);
            stonePath.rotateY(Math.PI / 2)
            this.scene.add(stonePath);
        });
    }
      
    private loadLanterns() {
        this.loader.load('/models/stone_lantern.glb', (gltf) => {
            const lantern = gltf.scene;
            lantern.scale.set(0.01, 0.01, 0.01);
        
            const spacing = 2.0;
            const xOffset = 1.5;
        
            for (let i = 0; i < 3; i++) { //3 lanterns
                const z = -i * spacing;
        
                const leftLantern = lantern.clone();
                leftLantern.position.set(-xOffset + 0.5, 0, z + 5);
                this.scene.add(leftLantern);
        
                const rightLantern = lantern.clone();
                rightLantern.position.set(xOffset + 0.5, 0, z + 5);
                this.scene.add(rightLantern);
            }
        });
    }
      

    private loadPetals() {
        const path = '/models/cherry_blossom_petal.glb';
        this.loader.load(path, (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.2, 0.2, 0.2);

            for (let i = 0; i < 250; i++) { //250 petals
                const petal = model.clone();

                //Randomize positions and rotations for each petal
                petal.position.set(
                (Math.random() - 0.5) * 10,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 10
                );

                petal.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
                );

                this.scene.add(petal);
                this.petals.push(petal);
            }
        });
    }

    private addDebugCube() {
        const geo = new THREE.BoxGeometry();
        const mat = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
        const cube = new THREE.Mesh(geo, mat);
        this.scene.add(cube);
    }

    public update() {
        this.animatePetals();
        this.renderer.render(this.scene, this.camera);
    }

    private animatePetals() {
        for (const petal of this.petals) {
            petal.position.y -= 0.01; // Falling
            petal.position.x += Math.sin(Date.now() * 0.001 + petal.position.y) * 0.001; // Flutter
            petal.rotation.y += 0.01; // Slow spin

            // Reset when too low
            if (petal.position.y < 0) {
                petal.position.y = 5;
                petal.position.x = (Math.random() - 0.5) * 10;
                petal.position.z = (Math.random() - 0.5) * 10;
            }
        }
    }

    //Function to handle window resizing
    private handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private addTextPlane() {
        const loader = new FontLoader();
        const headings = ["about me", "projects", "experience", "education"]

        loader.load('/fonts/Shikamaru.json', (font) => {
            const geometry = new TextGeometry('Kaden Seto', {
                font: font,
                size: 0.38,
                depth: 0.2,
                curveSegments: 12,
                bevelEnabled: false
            });

            geometry.center();

            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.3,
                roughness: 0.4,
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);

            // Position under the Torii gate's top beam
            mesh.position.set(0, 4.15, 0.25);
            this.scene.add(mesh);

        loader.load('/fonts/Mori.json', (font) => {
            const material = new THREE.MeshStandardMaterial({
                color: 0x000000,
                metalness: 0.2,
                roughness: 0.6,
            });

            const yInitial = 2.8;
            const spacing = 0.45;

            headings.forEach((label, index) => {
                const headingGeo = new TextGeometry(label, {
                    font: font,
                    size: 0.25,
                    depth: 0.08,
                    curveSegments: 10,
                    bevelEnabled: false,
                });
        
                headingGeo.center();
        
                const headingMesh = new THREE.Mesh(headingGeo, material);
                headingMesh.position.set(0, yInitial - index * spacing, 0);
                this.scene.add(headingMesh);
            });
            });
        }, undefined, (e) => {
            console.error(e);
        });
    }
}
