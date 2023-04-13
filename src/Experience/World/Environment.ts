import GUI from 'lil-gui';
import * as THREE from 'three'
import Experience from "../Experience";
import Debug from '../Utils/Debug';
import Resources from './Resources';

export default class Environment {
  experience: Experience
  scene: THREE.Scene
  spotLight!: THREE.SpotLight
  resources: Resources
  debug: Debug
  debugFolder!: GUI;

  environmentMap: {
    updateMaterial?: () => void,
    intensity: number,
    texture: THREE.Texture | null,
    encoding: THREE.TextureEncoding
  } = {
    intensity: 0.4,
    encoding: THREE.sRGBEncoding,
    texture: null
  }

  constructor(experience: Experience) {
    this.experience = experience
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Environment')
    }
    
    this.setLight()
    this.setEnvironmentMap()
  }

  setLight() {
    const hemiLight = new THREE.HemisphereLight( 0x443333, 0x111122 );
    this.scene.add( hemiLight );

    this.spotLight = new THREE.SpotLight();
    this.spotLight.angle = Math.PI / 16;
    this.spotLight.penumbra = 0.5;
    // spotLight.castShadow = true;
    this.spotLight.position.set( - 1, 1, 1 );
    this.scene.add(this.spotLight)

    // Set debug
    if (this.debug.active) {
      this.debugFolder.add(this.spotLight, 'intensity')
        .min(0)
        .max(10)
        .name('light intensity')
        .step(0.001)

      this.debugFolder.add(this.spotLight.position, 'x')
        .min(-5)
        .max(5)
        .name('light x')
        .step(0.001)
      
      this.debugFolder.add(this.spotLight.position, 'y')
        .min(-5)
        .max(5)
        .name('light y')
        .step(0.001)

      this.debugFolder.add(this.spotLight.position, 'z')
        .min(-5)
        .max(5)
        .name('light z')
        .step(0.001)
    }
  }

  setEnvironmentMap() {
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.scene.environment = this.environmentMap.texture

    this.environmentMap.updateMaterial = () => {
      this.scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture
          child.material.envMapIntensity = this.environmentMap.intensity
          child.material.needsUpdate = true
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }

    this.environmentMap.updateMaterial()

    // Set debug
    if (this.debug.active) {
      this.debugFolder.add(this.environmentMap, 'intensity')
        .min(0)
        .max(4)
        .step(0.001)
        .name('Environment intensity')
        .onChange(this.environmentMap.updateMaterial)
    }
  }
}

