import gsap from 'gsap';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from "./Experience";
import Sizes from './Utils/Sizes';

export default class Camera {
  experience: Experience
  instance!: THREE.PerspectiveCamera;
  sizes: Sizes
  scene: THREE.Scene
  canvas: HTMLElement
  controls!: OrbitControls;


  constructor(experience: Experience) {
    this.experience = experience
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.setInstance()

    this.experience.resources.on('loaded', () => {
      this.instance.position.set(0, 0, 1)
      this.instance.lookAt(0, 0, 0)
    })

    this.experience.sectionEmitter.on('entered', (id) => {
      switch (id) {
        case 'intro':
          this.moveTo(new THREE.Vector3(0, 0, 0))
          this.instance.lookAt(new THREE.Vector3(0, 0, 0))
          break;
        case 'services':
          if (this.experience.world.ruby) {
            const target = this.experience.world.ruby?.scene.position.clone()
            target.x += 0.5
            this.moveTo(target)
            this.instance.lookAt(this.experience.world.ruby?.scene.position)
          }
          break;
        default:
          break;
      }
    })
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      75, this.sizes.width / this.sizes.height, 0.1, 100
    )
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
    this.controls.enabled = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  moveTo(position: THREE.Vector3) {
    gsap.to(this.instance.position, { 
      delay:0,
      duration: 0.5,
      x: position.x,
      y: position.y,
      z: position.z + 1,
      onUpdate: () => {
        this.instance.updateProjectionMatrix();
        // console.log("play");
      },
      onComplete: () =>{
        // console.log("complete");
      },
      ease: "none"
    });
  }

  update() {
    // this.controls.update()
  }
}