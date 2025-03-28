import Environment from './environment/Environment';
import CameraControls from './controller/Camera';

const container = document.body;
const env = new Environment(container);
const controls = new CameraControls(env.camera, env.renderer);

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  env.update();
};

animate();