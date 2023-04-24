import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Experience from "./Experience";
import Sizes from "./Utils/Sizes";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';

export default class Renderer {
  experience: Experience
  instance!: THREE.WebGLRenderer;
  sizes: Sizes
  scene: THREE.Scene
  canvas: HTMLElement
  composer: EffectComposer
  ssrPass: SSRPass

  constructor(experience: Experience) {
    this.experience = experience
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })

    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.toneMapping = THREE.ReinhardToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFShadowMap
    // this.instance.setClearColor('#211d20')
    this.instance.autoClear = false
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)

    this.composer = new EffectComposer( this.instance );
		this.ssrPass = new SSRPass( {
      renderer: this.instance,
      scene: this.experience.scene,
      camera: this.experience.camera.instance,
      width: this.sizes.width,
      height: this.sizes.height,
      groundReflector: this.experience.world.groundReflector,
      selects: [this.experience.world.reflectedObjects]
    });

    this.ssrPass.thickness = 0.018;
    this.ssrPass.infiniteThick = false;
    this.ssrPass.opacity = 1;
    // this.experience.world.groundReflector.opacity = this.ssrPass.opacity
    this.ssrPass.maxDistance = .1;
    
    this.composer.addPass( this.ssrPass );
    this.composer.addPass( new ShaderPass( GammaCorrectionShader ) );
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
    this.composer.setSize(this.sizes.width, this.sizes.height);
  }

  update() {
    // this.instance.render(this.scene, this.experience.camera.instance)
    this.composer.render()
  }
}