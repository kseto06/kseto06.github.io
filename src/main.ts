import Environment from './environment/Environment';
import CameraControls from './controller/Camera';

const container: HTMLElement = document.body;
const env: Environment = new Environment(container);
const controls: CameraControls = new CameraControls(env.camera, env.renderer);

const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    env.update();
};

animate();