import * as THREE from 'three';
import { manager } from './Manager'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ActionHandler } from '../controller/ActionHandler';

export default class Environment {
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public clock: THREE.Clock = new THREE.Clock();
    public actionHandler: ActionHandler;
    public composer: EffectComposer;

    private petals: THREE.Object3D[] = [];
    private loader: GLTFLoader  = new GLTFLoader(manager);
    private listener: THREE.AudioListener;
    private audio: THREE.Audio;
    private audioLoader: THREE.AudioLoader;
    private websiteEntered: boolean = false;

    private playlist: string[] = [
        '/music/shooting_stars_in_summer.mp3',
        '/music/way_of_the_ghost.mp3',
    ];
    private playlistNames: string[] = [
        'Shooting Stars in Summer - Naoko Ikeda',
        'Way of the Ghost - Ilan Eshkeri',
    ];

    private currentTrack: number = 0;
    private isMuted: boolean = false;

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
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        //Effect composer
        this.composer = new EffectComposer(this.renderer);

        //Music
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);

        this.audio = new THREE.Audio(this.listener);
        this.audioLoader = new THREE.AudioLoader(manager);

        window.addEventListener('click', async () => {
            if (THREE.AudioContext.getContext().state === 'suspended') {
                try {
                    await THREE.AudioContext.getContext().resume();
                } catch (e) {
                    console.error('Audio context resume failed:', e);
                }
            }

            if (!this.websiteEntered) {
                this.websiteEntered = true;
                this.playTrack(this.currentTrack);
            } else if (!this.audio.isPlaying && this.audio.buffer && !this.isMuted) {
                this.audio.play();
            }
        });

        this.audio.onEnded = () => {
            // Cyclic indexing
            this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
            this.playTrack(this.currentTrack);
        };

        const muteButton = document.getElementById('mute-button') as HTMLButtonElement;
        const muteIcon = document.getElementById('mute-icon') as HTMLImageElement;

        if (muteButton && muteIcon) {
            muteButton.addEventListener('click', () => {
                this.isMuted = !this.isMuted;
                this.audio.setVolume(this.isMuted ? 0 : 0.3);
                muteIcon.src = this.isMuted ? '/music/icons/mute.png' : '/music/icons/unmute.png';
                this.audio.pause();

                //Text unmuting edge case
                const textOverlay: HTMLElement | null = document.getElementById('overlay-text');
                if (textOverlay && !this.isMuted) {
                    textOverlay.innerHTML = `<p>🎵 ${this.playlistNames[this.currentTrack]}</p>`;
                }
            });
        }

        this.loadEnv();

        if (!this.isMuted) {
            //Text
            const textOverlay: HTMLElement | null = document.getElementById('overlay-text');
            if (textOverlay && !this.isMuted) {
                textOverlay.innerHTML = `<p>🎵 ${this.playlistNames[this.currentTrack]}</p>`;
            }
        }
        window.addEventListener('resize', this.handleResize.bind(this));
        this.actionHandler = new ActionHandler(this.scene, this.camera, this.composer); //Action controller
    }

    private loadEnv(): void {
        //Lighting & Properties
        this.addLighting();
        this.addBackground();

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

    public update(): void {
        this.animatePetals();
        this.renderer.render(this.scene, this.camera);
        this.composer.render();
    }

    private addLighting(): void {
        const ambient: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        const sun: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sun.position.set(5, 10, 7.5);
        this.scene.add(sun);

        const hemi: THREE.HemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(hemi);
    }

    private addBackground(): void {
        // Sky background with sun:
        const sky: Sky = new Sky();
        sky.scale.setScalar(450000);
        this.scene.add(sky);

        const sun: THREE.Vector3 = new THREE.Vector3();
        const skyUniforms: any = (sky.material as any).uniforms;

        skyUniforms['turbidity'].value = 2;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.001;
        skyUniforms['mieDirectionalG'].value = 0.6;

        // Position the sun in the sky:
        const phi: number= THREE.MathUtils.degToRad(-84);
        const theta: number = THREE.MathUtils.degToRad(180);  
        sun.setFromSphericalCoords(1, phi, theta);

        skyUniforms['sunPosition'].value.copy(sun);

        const sunlight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
        sunlight.position.set(-10, 12.5, 10);
        sunlight.target.position.set(0, 0, 0);
        sunlight.shadow.bias = -0.001;
        sunlight.shadow.mapSize.width = 2048;
        sunlight.shadow.mapSize.height = 2048;
        sunlight.shadow.camera.near = 0.5;
        sunlight.shadow.camera.far = 50;
        sunlight.castShadow = true;
        //sunlight.position.copy(sun).multiplyScalar(1000);
        this.scene.add(sunlight);
    }

    private addGround(): void {
        //Add the grass texture
        const textureLoader: THREE.TextureLoader = new THREE.TextureLoader(manager);

        //Add the maps for the texture
        const maps: THREE.Texture[] = [textureLoader.load('/textures/grass/Color.jpg'), 
                                       textureLoader.load('/textures/grass/NormalGL.jpg'), 
                                       textureLoader.load('/textures/grass/Roughness.jpg'),
                                       textureLoader.load('/textures/grass/AmbientOcclusion.jpg'),
                                       textureLoader.load('/textures/grass/Displacement.jpg')];
            
        //Apply texture
        maps.forEach(texture => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
        })

        //Apply the grass texture to the ground
        const groundGeo = new THREE.PlaneGeometry(10, 11.6, 50, 60);
        const [
            colorMap,
            normalMap,
            roughnessMap,
            aoMap,
            displacementMap
        ] = maps;
          
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: colorMap,
            normalMap: normalMap,
            roughnessMap: roughnessMap,
            aoMap: aoMap,
            displacementMap: displacementMap,
            displacementScale: 0.2,
        });

        const ground = new THREE.Mesh(groundGeo, groundMaterial);

        ground.receiveShadow = true;
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.position.z = 2.0;
        this.scene.add(ground);
    }

    private loadToriiGate(): void {
        this.loader.load('/models/torii_gate.glb', (gltf) => {
            const torii: THREE.Group<THREE.Object3DEventMap> = gltf.scene;
            torii.scale.set(1, 1, 1);
            torii.position.set(0, 0, 0);
            this.addShadow(torii);
            this.scene.add(torii);
        });
    }
      
    private loadTrees(): void {
        this.loader.load('/models/sakura_tree_low_poly_model.glb', (gltf) => {
            const tree: THREE.Group<THREE.Object3DEventMap> = gltf.scene;
            tree.scale.set(15, 15, 15);
        
            const spacing: number = 4; // Spacing between lanterns
            const zOffset: number = 0; 
        
            const leftTree: THREE.Group<THREE.Object3DEventMap> = tree.clone();
            leftTree.position.set(-spacing, 0, zOffset);
            this.addShadow(leftTree);
            this.scene.add(leftTree);
        
            const rightTree: THREE.Group<THREE.Object3DEventMap> = tree.clone();
            rightTree.position.set(spacing, 0, zOffset);
            this.addShadow(rightTree);
            this.scene.add(rightTree);
        });
    }
      
    private loadStonePath(): void {
        this.loader.load('/models/stone_path.glb', (gltf) => {
            const stonePath: THREE.Group<THREE.Object3DEventMap> = gltf.scene;
            stonePath.scale.set(1.4, 1, 1);
            stonePath.position.set(0, 0.1944, 1.9);
            stonePath.rotateY(Math.PI / 2)
            this.addShadow(stonePath);
            this.scene.add(stonePath);
        });
    }
      
    private loadLanterns(): void {
        this.loader.load('/models/stone_lantern.glb', (gltf) => {
            const lantern: THREE.Group<THREE.Object3DEventMap> = gltf.scene;
            lantern.scale.set(0.01, 0.01, 0.01);
        
            const spacing: number = 2.0;
            const xOffset: number = 1.5;
        
            for (let i = 0; i < 3; i++) { //3 lanterns
                const z = -i * spacing;
        
                const leftLantern = lantern.clone();
                leftLantern.position.set(-xOffset + 0.5, 0, z + 5);
                this.addShadow(leftLantern);
                this.scene.add(leftLantern);
        
                const rightLantern = lantern.clone();
                rightLantern.position.set(xOffset + 0.5, 0, z + 5);
                this.addShadow(rightLantern);
                this.scene.add(rightLantern);
            }
        });
    }
      

    private loadPetals(): void {
        const path: string = '/models/cherry_blossom_petal.glb';
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

    private animatePetals(): void {
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
    private handleResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private addTextPlane(): void {
        const loader: FontLoader = new FontLoader(manager);
        const headings: string[] = ["about me", "projects", "experience", "portfolio"]

        loader.load('/fonts/Shikamaru.json', (font) => {
            const geometry = new TextGeometry('Kaden Seto', {
                font: font,
                size: 0.38,
                depth: 0.01,
                curveSegments: 12,
                bevelEnabled: false
            });

            geometry.center();

            const material = new THREE.MeshStandardMaterial({
                color: 0xffc0cb,
                metalness: 0.3,
                roughness: 0.4,
                side: THREE.DoubleSide,
                emissive: new THREE.Color(0xffc0cb),
                emissiveIntensity: 0.6 
            });

            const mesh = new THREE.Mesh(geometry, material);

            // Position under the Torii gate's top beam
            mesh.position.set(0, 4.15, 0.127);
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
                headingGeo.computeBoundingBox();
                headingGeo.boundingBox?.expandByScalar(1.2);
        
                const headingMesh = new THREE.Mesh(headingGeo, material);
                headingMesh.userData.label = label;
                this.actionHandler.registerClickable(headingMesh, label);
                headingMesh.position.set(0, yInitial - index * spacing, 0);
                this.scene.add(headingMesh);

                //Hitbox
                const hitboxGeo = new THREE.BoxGeometry(
                    (headingGeo.boundingBox!.max.x - headingGeo.boundingBox!.min.x) * 0.45,
                    0.3,
                    0.1 
                );

                const hitboxMesh = new THREE.Mesh(
                    hitboxGeo,
                    new THREE.MeshBasicMaterial({ visible: false })
                );

                hitboxMesh.position.copy(headingMesh.position);
                hitboxMesh.position.z -= 0.05; 
                
                // Link text mesh to hitbox
                hitboxMesh.userData.linkedText = headingMesh;
                
                this.scene.add(hitboxMesh);
                this.actionHandler.registerClickable(hitboxMesh, label);
            });
        });
        }, undefined, (e) => {
            console.error(e);
        });
    }

    private addShadow(model: THREE.Group<THREE.Object3DEventMap>): void {
        model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    private playTrack(idx: number): void {
        this.audioLoader.load(this.playlist[idx], (buffer) => {
            this.audio.stop();
            this.audio.setBuffer(buffer);
            this.audio.setLoop(false);
            this.audio.setVolume(0.3);

            //Text
            const textOverlay: HTMLElement | null = document.getElementById('overlay-text');
            if (textOverlay && !this.isMuted) {
                textOverlay.innerHTML = `<p>🎵 ${this.playlistNames[idx]}</p>`;
            }

            if (!this.isMuted && this.audio.context.state !== 'suspended') {
                try {
                   this.audio.play();
                } catch (e) {
                    console.error('Audio play failed:', e);
                }
            }
        });
    }
}
