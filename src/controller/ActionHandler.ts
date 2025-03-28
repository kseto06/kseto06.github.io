import { createProjectPopup } from '../pages/projects';
import * as THREE from 'three';

export class ActionHandler {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private clickableMeshes: THREE.Mesh[] = [];

  constructor(camera: THREE.Camera) {
    window.addEventListener('click', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, camera);
      const intersects = this.raycaster.intersectObjects(this.clickableMeshes);

      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const label = (mesh as any).userData.label;

        console.log('Clicked:', label);

        if (label == 'projects') {
            const page = document.getElementById('projects');
            if (!page) {
                const page = createProjectPopup();
                document.body.appendChild(page);

                console.log('📦 Popup element added:', page);
                console.log('📦 Is in DOM:', document.body.contains(page)); // Should be true

            }
        }
      }
    });
  }

  public registerClickable(mesh: THREE.Mesh, label: string) {
    mesh.userData.label = label;
    this.clickableMeshes.push(mesh);
  }
}
