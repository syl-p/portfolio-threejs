import GUI from 'lil-gui';
import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import Experience from "../Experience";
import Debug from '../Utils/Debug';
import Environment from './Environment';
import Resources from './Resources';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';

export default class World {
  experience: Experience
  scene: THREE.Scene
  environment!: Environment
  resources: Resources
  debug: Debug
  groundReflector: ReflectorForSSRPass
  // My World objects
  reflectedObjects: any[] = []
  ruby?: GLTF
  animation: {
    animationMixer: THREE.AnimationMixer | null, 
    actions: any,
    play: (name: string) => void
  } = {
    actions: {},
    animationMixer: null,
    play: function (): void {
      throw new Error('Function not implemented.');
    }
  }
  humanDebug!: GUI;
  
  constructor(experience: Experience) {
    this.experience = experience
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // Prepare Debug
    if(this.debug.active) {
      this.humanDebug = this.debug.ui.addFolder('human')
    }

    // Setup element
    this.resources.on('ready', () => {
      this.setFloor()
      this.setRuby()

      // Start environment
      this.environment = new Environment(this.experience)
    })
  }

  setRuby() {
    this.ruby = this.resources.items.ruby
    const material = new THREE.MeshStandardMaterial({ color: 'red' })

    if (this.ruby) {
      this.ruby.scene.scale.set(0.05, 0.05, 0.05)
      this.ruby.scene.position.set(0, 0.05, 0)

      this.scene.add(this.ruby.scene)
  
      this.ruby.scene.traverse((child) => {
        if(child instanceof THREE.Mesh) {
          child.castShadow = true
          child.material = material
          this.reflectedObjects.push(child)
        }
      })

      // Debug
      if(this.debug.active) {

      }
    }
  }

  setFloor() {
    // Ground
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry( 8, 8 ),
      new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
    );

    plane.rotation.x = - Math.PI / 2;
    plane.position.y = - 0.0001;
    // plane.receiveShadow = true;
    this.scene.add( plane );


    const geometry = new THREE.PlaneGeometry( 1, 1 );
    this.groundReflector = new ReflectorForSSRPass( geometry, {
      clipBias: 0.0003,
      textureWidth: this.experience.sizes.width,
      textureHeight: this.experience.sizes.height,
      color: 0x888888,
      useDepthTexture: true,
    } );

    this.groundReflector.material.depthWrite = false;
    this.groundReflector.rotation.x = - Math.PI / 2;
    this.groundReflector.visible = true;
    this.scene.add( this.groundReflector );
  }
  
  resize() {
    this.groundReflector.getRenderTarget().setSize(this.experience.sizes.width, this.experience.sizes.height);
    this.groundReflector.resolution.set(this.experience.sizes.width, this.experience.sizes.height);
  }

  update() {
    // if (this.animation.animationMixer)
    //   this.animation.animationMixer.update(this.experience.time.delta * 0.001)

    if (this.ruby)
      this.ruby.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.experience.time.delta * 0.001)
  }
}

