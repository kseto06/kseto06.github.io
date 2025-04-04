import * as THREE from 'three';
import { createProjectPopup } from '../pages/projects';
import { createAboutMePopup } from '../pages/aboutme';
import { createExperiencePopup } from '../pages/experience';
import { createPraxisPopup } from '../pages/praxis';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';

export class ActionHandler {
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();
    private clickableMeshes: THREE.Mesh[] = [];

    //Outlining meshes
    private hovered: THREE.Object3D | null = null;
    private outline: OutlinePass;

    constructor(scene: THREE.Scene, camera: THREE.Camera, composer: EffectComposer) {
        // Base rendering pass
        composer.addPass(new RenderPass(scene, camera));

        // Construct the new outlinePass for mesh outlining
        this.outline = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            scene,
            camera
        );

        this.outline.edgeStrength = 1.2;
        this.outline.edgeGlow = 1.5;
        this.outline.edgeThickness = 0.2;
        this.outline.pulsePeriod = 0;
        this.outline.visibleEdgeColor.set('#ffe8a1');
        this.outline.hiddenEdgeColor.set('#000000');

        composer.addPass(this.outline);

        //Add the gamma correction so the env doesn't render dark
        composer.addPass(new ShaderPass(GammaCorrectionShader));

        // Check for clicks on the meshes
        window.addEventListener('click', async (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, camera);
            const intersects = this.raycaster.intersectObjects(this.clickableMeshes);

            if (intersects.length > 0) {
                const mesh = intersects[0].object;
                const label = (mesh as any).userData.label;

                console.log('Clicked:', label);

                if (label) {
                    var page: HTMLElement | null = document.getElementById(label);
                    if (!page) {
                        page = await createProjectPopup(); //Default: projects

                        if (label === "about me") {
                            page = await createAboutMePopup();
                        } else if (label === "experience") {
                            page = await createExperiencePopup();
                        } else if (label === "portfolio") {
                            page = await createPraxisPopup();
                        }

                        document.body.appendChild(page);
                    }
                }
            }
        });

        //Check for hovering on the meshes:
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, camera);
            const intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[] = this.raycaster.intersectObjects(this.clickableMeshes);

            this.clickableMeshes.forEach(mesh => {
                if (mesh.userData.linkedText) {
                    mesh.userData.linkedText.material.emissiveIntensity = 0;
                }
            });
        
            if (intersects.length > 0) {
                const hitbox: THREE.Object3D<THREE.Object3DEventMap> = intersects[0].object;
                if (hitbox.userData?.linkedText) {
                    this.hovered = hitbox;
                    this.outline.selectedObjects = [hitbox.userData.linkedText];
                }
            } else {
                this.outline.selectedObjects = [];
                this.hovered = null;
            }
        });
    }

    public registerClickable(mesh: THREE.Mesh, label: string): void {
        mesh.userData.label = label;
        this.clickableMeshes.push(mesh);
    }
}
